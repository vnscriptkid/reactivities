using System.Linq;
using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;

            CreateMap<Activity, Activity>();

            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, e => e.MapFrom(a =>
                    a.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName))
                .ForMember(d => d.Profiles, e => e.MapFrom(a => a.Attendees));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, e => e.MapFrom(aa => aa.AppUser.DisplayName))
                .ForMember(d => d.Username, e => e.MapFrom(aa => aa.AppUser.UserName))
                .ForMember(d => d.Bio, e => e.MapFrom(aa => aa.AppUser.Bio))
                .ForMember(d => d.Image, e => e.MapFrom(aa => aa.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Username, e => e.MapFrom(a => a.UserName))
                .ForMember(d => d.Image, e => e.MapFrom(a => a.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(d => d.FollowersCount, e => e.MapFrom(a => a.Followers.Count))
                .ForMember(d => d.FollowingCount, e => e.MapFrom(a => a.Followings.Count))
                .ForMember(d => d.Following, e =>
                    e.MapFrom(a => a.Followers.Any(f => f.Observer.UserName == currentUsername)));

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.Username, e => e.MapFrom(c => c.Author.UserName))
                .ForMember(d => d.DisplayName, e => e.MapFrom(c => c.Author.DisplayName))
                .ForMember(d => d.Image, e => e.MapFrom(c => c.Author.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}