using JournalBackend.DTOs;

namespace JournalBackend.Services.Interfaces;

public interface IJournalService
{
    Task<IEnumerable<JournalEntryDto>> GetAllEntriesAsync(string userId);
    Task<JournalEntryDetailDto?> GetEntryByIdAsync(int id, string userId);
    Task<JournalEntryDetailDto> CreateEntryAsync(JournalEntryCreateDto dto, string userId);
    Task<bool> UpdateEntryAsync(int id, JournalEntryCreateDto dto, string userId);
    Task<bool> DeleteEntryAsync(int id, string userId);
Task<JournalEntryDetailDto?> TogglePinAsync(int id, string userId);
Task<JournalEntryDetailDto?> ToggleFavoriteAsync(int id, string userId);

    
}