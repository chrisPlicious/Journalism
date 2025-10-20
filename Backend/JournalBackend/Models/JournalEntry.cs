
// OOP Pillars: Encapsulation (properties encapsulate data).
// SOLID: Single Responsibility - Represents journal entry data.


using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace JournalBackend.Models;

[Index(nameof(UserId), nameof(Title), IsUnique = true)]
public class JournalEntry
{

    [Key]
    public int Id { get; set; }

    [Required, MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsPinned { get; set; } = false;
    public bool IsFavorite { get; set; } = false;

    // Foreign key to User
    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public User? User { get; set; }
}