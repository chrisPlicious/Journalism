
// OOP Pillars: Encapsulation (private data), Abstraction (public methods hide implementation).
// SOLID: Single Responsibility - Handle journal CRUD.
// LINQ: Used extensively in queries (Where, Select, FirstOrDefaultAsync).

using JournalBackend.Data;
using JournalBackend.DTOs;
using JournalBackend.Models;
using JournalBackend.Repositories.Interfaces;
using JournalBackend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JournalBackend.Services.Implementations;

public class JournalService : IJournalService
{
    private readonly IJournalEntryRepository _journalEntryRepository;

    public JournalService(IJournalEntryRepository journalEntryRepository)
    {
        _journalEntryRepository = journalEntryRepository;
    }

    public async Task<IEnumerable<JournalEntryDto>> GetAllEntriesAsync(string userId)
    {
        var entries = await _journalEntryRepository.GetEntriesByUserIdAsync(userId);
        return entries.Select(e => new JournalEntryDto
        {
            Id = e.Id,
            Title = e.Title,
            Category = e.Category,
            Content = e.Content,
            CreatedAt = e.CreatedAt
        });
    }

    public async Task<JournalEntryDetailDto?> GetEntryByIdAsync(int id, string userId)
    {
        var entry = await _journalEntryRepository.GetEntryByIdAndUserIdAsync(id, userId);

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
        // Check if title already exists for this user
        var titleTaken = await _journalEntryRepository.IsTitleTakenByUserAsync(dto.Title, userId);

        if (titleTaken)
        {
            throw new InvalidOperationException("A journal entry with this title already exists.");
        }

        var entry = new JournalEntry
        {
            Title = dto.Title,
            Category = dto.Category,
            Content = dto.Content,
            UserId = userId
        };

        await _journalEntryRepository.AddAsync(entry);
        await _journalEntryRepository.SaveChangesAsync();

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
        var entry = await _journalEntryRepository.GetEntryByIdAndUserIdAsync(id, userId);

        if (entry == null) return false;

        entry.Title = dto.Title;
        entry.Category = dto.Category;
        entry.Content = dto.Content;
        entry.UpdatedAt = DateTime.UtcNow;

        _journalEntryRepository.Update(entry);
        await _journalEntryRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteEntryAsync(int id, string userId)
    {
        var entry = await _journalEntryRepository.GetEntryByIdAndUserIdAsync(id, userId);

        if (entry == null) return false;

        _journalEntryRepository.Remove(entry);
        await _journalEntryRepository.SaveChangesAsync();
        return true;
    }
}