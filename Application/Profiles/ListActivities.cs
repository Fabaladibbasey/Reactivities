using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<PageList<UserActivityDto>>>
        {
            public string UserName { get; set; }
            public string Predicate { get; set; }
            public PagingParams PagingParams { get; set; }

        }

        public class Handler : IRequestHandler<Query, Result<PageList<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<PageList<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.ActivityAttendees
                    .Where(u => u.AppUser.UserName == request.UserName)
                    .OrderBy(a => a.Activity.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUserName() })
                    .AsQueryable();

                queryable = request.Predicate switch
                {
                    "past" => queryable.Where(a => a.Date <= DateTime.Now),
                    "hosting" => queryable.Where(a => a.HostUsername == request.UserName),
                    _ => queryable.Where(a => a.Date >= DateTime.Now)
                };

                var activities = await PageList<UserActivityDto>.CreateAsync(queryable, request.PagingParams.PageNumber, request.PagingParams.PageSize);

                return Result<PageList<UserActivityDto>>.Success(activities);
            }
        }
    }
}