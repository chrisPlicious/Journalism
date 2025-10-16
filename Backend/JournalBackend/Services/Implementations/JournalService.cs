
// OOP Pillars: Encapsulation (private data), Abstraction (public methods hide implementation).
// SOLID: Single Responsibility - Handle journal CRUD.
// LINQ: Used extensively in queries (Where, Select, FirstOrDefaultAsync).

using JournalBackend.DTOs;
using JournalBackend.Models;
using JournalBackend.Repositories.Interfaces;
using JournalBackend.Services.Interfaces;
using AutoMapper;


namespace JournalBackend.Services.Implementations;

public class JournalService : IJournalService
{
    private readonly IJournalEntryRepository _journalEntryRepository;
    private readonly IMapper _mapper;

    public JournalService(IJournalEntryRepository journalEntryRepository, IMapper mapper)
    {
        _journalEntryRepository = journalEntryRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<JournalEntryDto>> GetAllEntriesAsync(string userId)
    {
        var entries = await _journalEntryRepository.GetEntriesByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<JournalEntryDto>>(entries);
    }

    public async Task<JournalEntryDetailDto?> GetEntryByIdAsync(int id, string userId)
    {
        var entry = await _journalEntryRepository.GetEntryByIdAndUserIdAsync(id, userId);

        if (entry == null) return null;

        return _mapper.Map<JournalEntryDetailDto>(entry);
    }

    public async Task<JournalEntryDetailDto> CreateEntryAsync(JournalEntryCreateDto dto, string userId)
    {
        // Check if title already exists for this user
        var titleTaken = await _journalEntryRepository.IsTitleTakenByUserAsync(dto.Title, userId);

        if (titleTaken)
        {
            throw new InvalidOperationException("A journal entry with this title already exists.");
        }

        var entry = _mapper.Map<JournalEntry>(dto);
        entry.UserId = userId;

        await _journalEntryRepository.AddAsync(entry);
        await _journalEntryRepository.SaveChangesAsync();

        return _mapper.Map<JournalEntryDetailDto>(entry);
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