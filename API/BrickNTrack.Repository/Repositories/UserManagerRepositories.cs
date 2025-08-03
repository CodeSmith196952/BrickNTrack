using AutoMapper;
using BrickNTrack.Doman.CommonModel;
using BrickNTrack.Doman.Model;
using BrickNTrack.Repository.Context;
using BrickNTrack.Repository.Entity;
using BrickNTrack.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using static BrickNTrack.Doman.CommonModel.ApplicationConstant;
using BC = BCrypt.Net.BCrypt;

namespace BrickNTrack.Repository.Repositories
{
    public class UserManagerRepositories : IUserManager
    {
        private readonly BrickNTrackContext _context;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public UserManagerRepositories(BrickNTrackContext context, 
            IConfiguration configuration, IMapper mapper) 
        {
            _context = context;
            _config = configuration;
            _mapper = mapper;
        }

        public async Task<(string token, string refreshToken)> LoginAsync(LoginRequestDTO request)
        {
            var user = await _context.UserManager.FirstOrDefaultAsync(x =>
                x.UserName == request.Username);

            if (user == null || !BC.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid credentials");

            var token = GenerateToken(user);
            var refreshToken = GenerateRefreshToken();

            var userToken = new UserToken
            {
                JwtToken = token,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(15),
                UserId = user.Id
            };

            _context.Tokens.Add(userToken);
            await _context.SaveChangesAsync();

            return (token, refreshToken);
        }

        public async Task<(string token, string refreshToken)> RefreshTokenAsync(RefreshRequestDTO request)
        {
            var tokenEntry = await _context.Tokens.Include(x => x.User)
                .FirstOrDefaultAsync(x => x.RefreshToken == request.RefreshToken);

            if (tokenEntry == null)
                throw new UnauthorizedAccessException("Invalid refresh token");

            var newToken = GenerateToken(tokenEntry.User);
            var newRefresh = GenerateRefreshToken();

            tokenEntry.JwtToken = newToken;
            tokenEntry.RefreshToken = newRefresh;
            tokenEntry.Expiration = DateTime.UtcNow.AddMinutes(15);

            await _context.SaveChangesAsync();

            return (newToken, newRefresh);
        }

        public string GenerateToken(UserManager user)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim("UserId", user.Id.ToString()),
            //new Claim(ClaimTypes.Role, user.RoleName)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(_config["JwtSettings:DurationInMinutes"]!)),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        public async Task<ResultModel> RegistereUserAsync(UserManagerRequest request)
        {
            ResultModel retValue = new ResultModel();
            try
            {
                if (request.Id > 0)
                {
                    var userDetail = await _context.UserManager.FirstOrDefaultAsync(x => x.Id == request.Id);
                    if (userDetail != null)
                    {
                        userDetail.FirstName = request.FirstName;
                        userDetail.LastName = request.LastName;
                        userDetail.Email = request.Email;
                        userDetail.MobileNumber = request.MobileNumber;
                        userDetail.IsActive = request.IsActive;
                        _context.UserManager.Update(userDetail);
                        await _context.SaveChangesAsync();
                        retValue.StatusCode = ResultCode.SuccessfullyUpdated;
                        retValue.ResponseMessage = "User updated successfully";
                    }
                    else
                    {

                        retValue.StatusCode = ResultCode.RecordNotFound;
                        retValue.ErrorMessage = "User not found";
                    }
                }
                else
                {
                    var duplicateUser = await _context.UserManager.FirstOrDefaultAsync(x => x.UserName == request.UserName);
                    if (duplicateUser != null) 
                    {
                        retValue.StatusCode = ResultCode.DuplicateRecord;
                        retValue.ErrorMessage = "Username is already registered";
                    }
                    var hashPassword = BC.HashPassword(request.Password);
                    var userDetails = _mapper.Map<UserManager>(request);
                    userDetails.PasswordHash = hashPassword;
                    _context.UserManager.Add(userDetails);
                    await _context.SaveChangesAsync();
                    retValue.StatusCode = ResultCode.SuccessfullyCreated;
                    retValue.ResponseMessage = "User created successfully";
                }
            }
            catch (Exception ex)
            {
                retValue.StatusCode = ResultCode.Invalid;
                retValue.ErrorMessage = ex.ToString();
            }
            return retValue;
        }
    }
}
