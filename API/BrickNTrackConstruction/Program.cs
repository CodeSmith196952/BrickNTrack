using BrickNTrack.Repository.Context;
using BrickNTrackConstruction.Core.Extension;
using BrickNTrackConstruction.Hubs;
using BrickNTrackConstruction.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var _configuration  = builder.Configuration;
ConfigurationServices(builder.Services);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    var key = builder.Configuration["JwtSettings:Key"];
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!))
    };
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed default admin user on startup
await DbSeeder.SeedAdminUserAsync(app.Services);
await DbSeeder.SeedAmenitiesAsync(app.Services);

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

// app.UseHttpsRedirection();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

// Serve uploaded project images as static files
var imageLocalDir = _configuration["AppSettings:ImageLocalDirectory"];
if (!string.IsNullOrEmpty(imageLocalDir) && Directory.Exists(imageLocalDir))
{
    var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
    provider.Mappings[".avif"] = "image/avif";
    provider.Mappings[".webp"] = "image/webp";
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(imageLocalDir),
        RequestPath = "/ProjectImage",
        ContentTypeProvider = provider,
        ServeUnknownFileTypes = true,
        DefaultContentType = "application/octet-stream"
    });
}

app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");
app.Run();

void ConfigurationServices(IServiceCollection services)
{
    services.AddAntiforgery(option =>
    {
        option.SuppressXFrameOptionsHeader = true;
    });
    services.AddDistributedMemoryCache();
    services.AddSession();
    services.AddCors(option =>
    {
        option.AddDefaultPolicy(
            builder =>
            {
                builder.WithOrigins(
                        "http://localhost:4200",
                        "http://localhost:5001"
                    )
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
    });


    //services.AddAutoMapper(typeof(Program));
    services.AddAutoMapper(typeof(Program));
    services.AddHttpContextAccessor();

    ServiceCollectionDIExtension.ConfigureServicesDependency(builder.Services);
    services.AddControllers();
    services.AddSignalR();
    ConfigureDbContext(services);
}

void ConfigureDbContext(IServiceCollection services)
{
    services.AddDbContext<BrickNTrackContext>(options =>
    options.UseSqlServer(_configuration.GetConnectionString("DefaultConnection")));
}