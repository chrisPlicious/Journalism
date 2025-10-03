// OOP: Service class for journal operations.
// OOP Pillars: Encapsulation (private data), Abstraction (public methods hide implementation).
// SOLID: Single Responsibility - Handle journal CRUD.
// LINQ: Used extensively in queries (Where, Select, FirstOrDefaultAsync).

using JournalBackend.Data;
using JournalBackend.DTOs;
using JournalBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace JournalBackend.Services;

public class JournalService
{
    private readonly ApplicationDbContext _context;

    public JournalService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<JournalEntryDto>> GetAllEntriesAsync(string userId)
    {
        return await _context.JournalEntries
            .Where(e => e.UserId == userId)
            .Select(e => new JournalEntryDto
            {
                Id = e.Id,
                Title = e.Title,
                Category = e.Category,
                Content = e.Content,
                CreatedAt = e.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<JournalEntryDetailDto?> GetEntryByIdAsync(int id, string userId)
    {
        var entry = await _context.JournalEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (entry == null) return null;

        return new JournalEntryDetailDto
        {
            Id = entry.Id,
            Title = entry.Title,
            Category = entry.Category,
            Content = entry.Content,
            CreatedAt = entry.CreatedAt,
            UpdatedAt = entry.UpdatedAt
        };
    }

    public async Task<JournalEntryDetailDto> CreateEntryAsync(JournalEntryCreateDto dto, string userId)
    {
        var entry = new JournalEntry
        {
            Title = dto.Title,
            Category = dto.Category,
            Content = dto.Content,
            UserId = userId
        };

        _context.JournalEntries.Add(entry);
        await _context.SaveChangesAsync();

        return new JournalEntryDetailDto
        {
            Id = entry.Id,
            Title = entry.Title,
            Category = entry.Category,
            Content = entry.Content,
            CreatedAt = entry.CreatedAt,
            UpdatedAt = entry.UpdatedAt
        };
    }

    public async Task<bool> UpdateEntryAsync(int id, JournalEntryCreateDto dto, string userId)
    {
        var entry = await _context.JournalEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (entry == null) return false;

        entry.Title = dto.Title;
        entry.Category = dto.Category;
        entry.Content = dto.Content;
        entry.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteEntryAsync(int id, string userId)
    {
        var entry = await _context.JournalEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (entry == null) return false;

        _context.JournalEntries.Remove(entry);
        await _context.SaveChangesAsync();
        return true;
    }
}