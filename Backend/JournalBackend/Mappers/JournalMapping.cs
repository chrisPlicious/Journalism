using AutoMapper;
using JournalBackend.DTOs;
using JournalBackend.Models;

namespace JournalBackend.Profiles;

public class JournalMappingProfile : Profile
{
    public JournalMappingProfile()
    {
        CreateMap<JournalEntry, JournalEntryDto>();
        CreateMap<JournalEntryDto, JournalEntry>();
        CreateMap<JournalEntry, JournalEntryDetailDto>();
        CreateMap<JournalEntryDetailDto, JournalEntry>();
        CreateMap<JournalEntryCreateDto, JournalEntry>();
    }
}