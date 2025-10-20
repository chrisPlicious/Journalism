// OOP: DTO class for transferring journal entry data.
// OOP Pillars: Encapsulation (properties encapsulate data).
// SOLID: Single Responsibility - Data transfer.
// LINQ: Not used.

namespace JournalBackend.DTOs;

public class JournalEntryDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsPinned { get; set; } = false;
    public bool IsFavorite { get; set; } = false;
}