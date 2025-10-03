// OOP: DTO for detailed journal entry data.
// OOP Pillars: Encapsulation (properties encapsulate data).
// SOLID: Single Responsibility - Data transfer.
// LINQ: Not used.

namespace JournalBackend.DTOs;

public class JournalEntryDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}