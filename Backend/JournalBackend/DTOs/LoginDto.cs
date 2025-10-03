// OOP: DTO for user login.
// OOP Pillars: Encapsulation (properties encapsulate data).
// SOLID: Single Responsibility - Data transfer.
// LINQ: Not used.

using System.ComponentModel.DataAnnotations;

namespace JournalBackend.DTOs;

public class LoginDto
{
    [Required]
    public string LoginIdentifier { get; set; } = string.Empty; // Email or Username

    [Required]
    public string Password { get; set; } = string.Empty;
}