using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class List
    {
        public class Query : IRequest<Result<List<CommentDto>>>
        {
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
        {

            // private readonly ICommentRepository _commentRepository;

            // public Handler(ICommentRepository commentRepository)
            // {
            //     _commentRepository = commentRepository;
            // }

            // public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
            // {

            //     var comments = await _commentRepository.GetCommentsForActivity(request.ActivityId);

            //     return Result<List<CommentDto>>.Success(comments);
            // }

            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = await _context.Comments
                .Where(x => x.Activity.Id == request.ActivityId)
                .OrderByDescending(x => x.CreatedAt)
                .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

                return Result<List<CommentDto>>.Success(comments);

            }

        }
    }
}