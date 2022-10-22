using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUserName { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _dataContext.Users
                    .Include(x => x.Followings)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                if (observer == null) return null;

                var target = await _dataContext.Users
                    .Include(x => x.Followers)
                    .FirstOrDefaultAsync(x => x.UserName == request.TargetUserName);

                if (target == null) return null;

                var following = await _dataContext.UserFollowings
                    .FirstOrDefaultAsync(x => x.ObserverId == observer.Id && x.TargetId == target.Id);

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    observer.Followings.Add(following);
                }
                else
                {
                    observer.Followings.Remove(following);
                }

                var success = await _dataContext.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}