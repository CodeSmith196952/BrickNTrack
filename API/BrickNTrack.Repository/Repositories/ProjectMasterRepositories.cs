using AutoMapper;
using BrickNTrack.Repository.Context;
using Microsoft.Extensions.Configuration;

namespace BrickNTrack.Repository.Repositories
{
    public class ProjectMasterRepositories
    {
        private readonly BrickNTrackContext _context;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public ProjectMasterRepositories(BrickNTrackContext context,
            IConfiguration configuration, IMapper mapper) 
        {
            _mapper = mapper;
        }


    }
}
