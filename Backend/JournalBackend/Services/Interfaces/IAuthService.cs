using JournalBackend.DTOs;
using JournalBackend.Models;

namespace JournalBackend.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task LogoutAsync();
    Task<User?> GetUserByIdAsync(string id);
    Task<User?> UpdateUserProfileAsync(string userId, UserProfileUpdateDto updateDto);
    Task<AuthResponseDto> GoogleSignInAsync(string idToken);
}