using JournalBackend.Data;
using JournalBackend.Models;
using JournalBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JournalBackend.Repositories.Implementations;

public class JournalEntryRepository : Repository<JournalEntry>, IJournalEntryRepository
{
    public JournalEntryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<JournalEntry>> GetEntriesByUserIdAsync(string userId)
    {
        return await FindAsync(e => e.UserId == userId);
    }

    public async Task<JournalEntry?> GetEntryByIdAndUserIdAsync(int id, string userId)
    {
        return await FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
    }

    public async Task<bool> IsTitleTakenByUserAsync(string title, string userId)
    {
        return await AnyAsync(e => e.Title == title && e.UserId == userId);
    }

    public async Task<bool> IsTitleTakenByUserAsync(string title, string userId, int excludeId)
    {
        return await AnyAsync(e => e.Title == title && e.UserId == userId && e.Id != excludeId);
    }

    public async Task<int> CountPinnedEntriesAsync(string userId)
{
    return await _context.JournalEntries
        .Where(j => j.UserId == userId && j.IsPinned)
        .CountAsync();
}

}