// OOP: This class represents a User entity, encapsulating user data and behavior.
// OOP Pillars: Inheritance (from IdentityUser), Encapsulation (properties hide data).
// SOLID: Single Responsibility - Handles user data only.

using Microsoft.AspNetCore.Identity;

namespace JournalBackend.Models;

public class User : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string AvatarUrl { get; set; } = "/avatar/MindNestLogoLight.png";
}