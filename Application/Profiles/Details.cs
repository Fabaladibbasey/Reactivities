using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Result<Profile>>
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
            private readonly DataContext _profileReader;
            private readonly IMapper _mapper;

            public Handler(DataContext profileReader, IMapper mapper)
            {
                _mapper = mapper;
                _profileReader = profileReader;
            }

            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                // var user = await _profileReader.Users
                //     .Include(p => p.Photos)
                //     .FirstOrDefaultAsync(x => x.UserName == request.Username);

                // if (user == null) return null;

                // var profile = _mapper.Map<AppUser, Profile>(user);

                // return Result<Profile>.Success(profile);

                var user = await _profileReader.Users
                    .ProjectTo<Profile>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x => x.UserName == request.UserName);

                return Result<Profile>.Success(user);
            }
        }
    }
}