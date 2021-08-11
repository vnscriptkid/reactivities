using System.Linq;
using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();

            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, e => e.MapFrom(a =>
                    a.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName))
                .ForMember(d => d.Profiles, e => e.MapFrom(a => a.Attendees));

            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(d => d.DisplayName, e => e.MapFrom(aa => aa.AppUser.DisplayName))
                .ForMember(d => d.Username, e => e.MapFrom(aa => aa.AppUser.UserName))
                .ForMember(d => d.Bio, e => e.MapFrom(aa => aa.AppUser.Bio));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Username, e => e.MapFrom(a => a.UserName))
                .ForMember(d => d.Image, e => e.MapFrom(a => a.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}