// OOP: DTO for creating journal entries.
// OOP Pillars: Encapsulation (properties encapsulate data).
// SOLID: Single Responsibility - Data transfer.
// LINQ: Not used.

using System.ComponentModel.DataAnnotations;

namespace JournalBackend.DTOs;

public class JournalEntryCreateDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;
}