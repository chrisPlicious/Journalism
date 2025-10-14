using JournalBackend.Models;

namespace JournalBackend.Repositories.Interfaces;

public interface IJournalEntryRepository : IRepository<JournalEntry>
{
    Task<IEnumerable<JournalEntry>> GetEntriesByUserIdAsync(string userId);
    Task<JournalEntry?> GetEntryByIdAndUserIdAsync(int id, string userId);
    Task<bool> IsTitleTakenByUserAsync(string title, string userId);
    Task<bool> IsTitleTakenByUserAsync(string title, string userId, int excludeId);
}