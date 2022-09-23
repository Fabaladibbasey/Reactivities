using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var dbActivity = await _context.Activities.FindAsync(request.Activity.Id);

                //manually mapping to update the activity
                // dbActiviy.Title = request.Activity.Title ?? dbActiviy.Title;
                // dbActiviy.Description = request.Activity.Description ?? dbActiviy.Description;

                //using Upated method in ef core
                // _context.Activities.Update(request.Activity);

                if (dbActivity == null) return null;

                //using automapper
                _mapper.Map(request.Activity, dbActivity);

                var edited = await _context.SaveChangesAsync() > 0;
                if (edited) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Failed to edit activity");
            }
        }
    }

}