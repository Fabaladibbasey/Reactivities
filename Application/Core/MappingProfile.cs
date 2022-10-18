using Application.Activities;
using Application.Comments;
using Application.Photos;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees
                    .FirstOrDefault(x => x.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));
            // .ForMember(d => d.Following, o => o.MapFrom<FollowingResolver>());

            CreateMap<AppUser, Profiles.Profile>()
            .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<Photo, PhotoDto>();

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}