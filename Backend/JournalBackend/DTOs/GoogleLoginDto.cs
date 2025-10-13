// OOP: DTO for Google ID token sign-in.
// SOLID: Single Responsibility - carries the Google ID token from client to server.

namespace JournalBackend.DTOs;

public class GoogleLoginDto
{
    public string IdToken { get; set; } = string.Empty;
}