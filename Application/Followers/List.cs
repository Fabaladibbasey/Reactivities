using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string UserName { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _dataContext = dataContext;
                _mapper = mapper;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await _dataContext.UserFollowings
                            .Where(x => x.Target.UserName == request.UserName)
                            .Select(x => x.Observer)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new { currentUserName = _userAccessor.GetUserName() })
                            .ToListAsync();
                        break;
                    case "following":
                        profiles = await _dataContext.UserFollowings
                            .Where(x => x.Observer.UserName == request.UserName)
                            .Select(x => x.Target)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new { currentUserName = _userAccessor.GetUserName() })
                            .ToListAsync();
                        break;
                }
                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}