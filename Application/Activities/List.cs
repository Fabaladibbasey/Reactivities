using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PageList<ActivityDto>>>
        {
            public ActivityParams PagingParams { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PageList<ActivityDto>>>
        {

            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PageList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .Where(d => d.Date >= request.PagingParams.StartDate)
                    .OrderBy(d => d.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { currentUserName = _userAccessor.GetUserName() })
                    .AsQueryable();

                if (request.PagingParams.IsGoing && !request.PagingParams.IsHost)

                {
                    query = query.Where(u => u.Attendees.Any(a => a.UserName == _userAccessor.GetUserName()));
                }

                if (request.PagingParams.IsHost && !request.PagingParams.IsGoing)
                {
                    query = query.Where(u => u.HostUsername == _userAccessor.GetUserName());
                }

                return Result<PageList<ActivityDto>>.Success(
                    await PageList<ActivityDto>.CreateAsync(query, request.PagingParams.PageNumber, request.PagingParams.PageSize)
                );
            }
        }
    }
}