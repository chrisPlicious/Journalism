using AutoMapper;
using JournalBackend.DTOs;
using JournalBackend.Models;

namespace JournalBackend.Profiles;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<User, UserProfileDto>();
        CreateMap<UserProfileDto, User>();
    }
}   