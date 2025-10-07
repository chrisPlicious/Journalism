// OOP: DTO for authentication response.
// OOP Pillars: Encapsulation (properties encapsulate data).
// SOLID: Single Responsibility - Data transfer.
// LINQ: Not used.

namespace JournalBackend.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}