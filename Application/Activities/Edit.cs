using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var dbActiviy = await _context.Activities.FindAsync(request.Activity.Id);

                //manually mapping to update the activity
                // dbActiviy.Title = request.Activity.Title ?? dbActiviy.Title;
                // dbActiviy.Description = request.Activity.Description ?? dbActiviy.Description;

                //using Upated method in ef core
                // _context.Activities.Update(request.Activity);

                //using automapper
                _mapper.Map(request.Activity, dbActiviy);

                await _context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }

}