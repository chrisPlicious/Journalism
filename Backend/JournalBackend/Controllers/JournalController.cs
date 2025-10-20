
// OOP Pillars: Encapsulation (private methods), Abstraction (public actions hide logic).
// SOLID: Single Responsibility - Handle journal HTTP requests.


using System.Security.Claims;
using JournalBackend.DTOs;
using JournalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static System.Net.WebRequestMethods;

namespace JournalBackend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class JournalController : ControllerBase
{
    private readonly IJournalService _journalService;

    public JournalController(IJournalService journalService)
    {
        _journalService = journalService;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

    [HttpGet]
    public async Task<IActionResult> GetAllEntries([FromQuery] string? filter)
    {
        var userId = GetUserId();
        var entries = await _journalService.GetAllEntriesAsync(userId);

        // ✅ Filter logic
        if (!string.IsNullOrEmpty(filter))
        {
            filter = filter.ToLower();

            if (filter == "pinned")
                entries = entries.Where(e => e.IsPinned).ToList();
            else if (filter == "favorites")
                entries = entries.Where(e => e.IsFavorite).ToList();
        }

        return Ok(entries);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEntryById(int id)
    {
        var userId = GetUserId();
        var entry = await _journalService.GetEntryByIdAsync(id, userId);
        if (entry == null)
            return NotFound();

        return Ok(entry);
    }

    [HttpPost]
    public async Task<IActionResult> CreateEntry([FromBody] JournalEntryCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();
        try
        {
            var entry = await _journalService.CreateEntryAsync(dto, userId);
            return CreatedAtAction(nameof(GetEntryById), new { id = entry.Id }, entry);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEntry(int id, [FromBody] JournalEntryCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();
        var success = await _journalService.UpdateEntryAsync(id, dto, userId);
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpPatch("{id}/pin")]
    public async Task<IActionResult> TogglePin(int id)
    {
        var userId = GetUserId();

        try
        {
            var updatedEntry = await _journalService.TogglePinAsync(id, userId);
            if (updatedEntry == null)
                return NotFound();
            return Ok(updatedEntry);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }

    }

    [HttpPatch("{id}/favorite")]
    public async Task<IActionResult> ToggleFavorite(int id)
    {
        var userId = GetUserId();

        var updatedEntry = await _journalService.ToggleFavoriteAsync(id, userId);
        if (updatedEntry == null)
            return NotFound();
        return Ok(updatedEntry);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEntry(int id)
    {
        var userId = GetUserId();
        var success = await _journalService.DeleteEntryAsync(id, userId);
        if (!success)
            return NotFound();

        return NoContent();
    }
}