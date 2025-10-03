// OOP: This class represents a JournalEntry entity.
// OOP Pillars: Encapsulation (properties encapsulate data).
// SOLID: Single Responsibility - Represents journal entry data.
// LINQ: Not used here, but queries will use LINQ.

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JournalBackend.Models;

public class JournalEntry
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key to User
    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public User? User { get; set; }
}