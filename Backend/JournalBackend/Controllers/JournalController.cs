// OOP: Controller class for journal endpoints.
// OOP Pillars: Encapsulation (private methods), Abstraction (public actions hide logic).
// SOLID: Single Responsibility - Handle journal HTTP requests.
// LINQ: Not used directly, but services use LINQ.

using System.Security.Claims;
using JournalBackend.DTOs;
using JournalBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JournalBackend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class JournalController : ControllerBase
{
    private readonly JournalService _journalService;

    public JournalController(JournalService journalService)
    {
        _journalService = journalService;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

    [HttpGet]
    public async Task<IActionResult> GetAllEntries()
    {
        var userId = GetUserId();
        var entries = await _journalService.GetAllEntriesAsync(userId);
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
        var entry = await _journalService.CreateEntryAsync(dto, userId);
        return CreatedAtAction(nameof(GetEntryById), new { id = entry.Id }, entry);
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