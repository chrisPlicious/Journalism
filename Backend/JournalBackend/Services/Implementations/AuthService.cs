// OOP Pillars: Encapsulation (private methods and data), Abstraction (public methods hide complexity).
// SOLID: Single Responsibility - Handle auth operations.


using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using BCrypt.Net;
using JournalBackend.Data;
using JournalBackend.DTOs;
using JournalBackend.Models;
using JournalBackend.Repositories.Interfaces;
using JournalBackend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Google.Apis.Auth;

namespace JournalBackend.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    private bool IsValidPassword(string password)
    {
        // At least 8 characters, at least 1 number, at least 1 non-alphanumeric
        var regex = new Regex(@"^(?=.*\d)(?=.*[^a-zA-Z0-9])(.{8,})$");
        return regex.IsMatch(password);
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        // Check if user exists
        var existingUser = await _userRepository.GetUserByEmailOrUsernameAsync(registerDto.Email) ??
                          await _userRepository.GetUserByEmailOrUsernameAsync(registerDto.Username);
        if (existingUser != null)
        {
            return new AuthResponseDto { Message = "User already exists." };
        }

        // Validate password strength
        if (!IsValidPassword(registerDto.Password))
        {
            return new AuthResponseDto { Message = "Password must be at least 8 characters long and contain at least one number and one non-alphanumeric character." };
        }

        var user = new User
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Gender = registerDto.Gender,
            DateOfBirth = registerDto.DateOfBirth,
            Email = registerDto.Email,
            UserName = registerDto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            IsProfileComplete = true  // Regular registration has complete profile
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        var token = GenerateJwtToken(user);
        return new AuthResponseDto { Token = token, Message = "Registration successful.", Username = user.UserName!, Email = user.Email!, AvatarUrl = user.AvatarUrl, IsProfileComplete = user.IsProfileComplete };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        var user = await _userRepository.GetUserByEmailOrUsernameAsync(loginDto.LoginIdentifier);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return new AuthResponseDto { Message = "Invalid credentials." };
        }

        var token = GenerateJwtToken(user);
        return new AuthResponseDto { Token = token, Message = "Login successful.", Username = user.UserName!, Email = user.Email!, AvatarUrl = user.AvatarUrl, IsProfileComplete = user.IsProfileComplete };
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task LogoutAsync()
    {
        // JWT logout is handled client-side by discarding the token
        await Task.CompletedTask;
    }

    public async Task<User?> GetUserByIdAsync(string id)
    {
        return await _userRepository.GetByIdAsync(id);
    }

    public async Task<User?> UpdateUserProfileAsync(string userId, UserProfileUpdateDto updateDto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return null;

        user.FirstName = updateDto.FirstName;
        user.LastName = updateDto.LastName;
        user.UserName = updateDto.UserName;
        user.Gender = updateDto.Gender;
        user.DateOfBirth = updateDto.DateOfBirth;
        user.AvatarUrl = updateDto.AvatarUrl;
        user.IsProfileComplete = true;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();
        return user;
    }

    // Google Sign-In: verify ID token, upsert/link user, and return JWT
    public async Task<AuthResponseDto> GoogleSignInAsync(string idToken)
    {
        Console.WriteLine($"[DEBUG] GoogleSignInAsync called with idToken length: {idToken?.Length ?? 0}");

        var clientId = _configuration["Google:ClientId"];
        if (string.IsNullOrWhiteSpace(clientId))
        {
            Console.WriteLine("[DEBUG] Google ClientId not configured.");
            return new AuthResponseDto { Message = "Google ClientId not configured." };
        }

        Console.WriteLine($"[DEBUG] Using Google ClientId: {clientId}");

        GoogleJsonWebSignature.Payload payload;
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId }
            };
            Console.WriteLine("[DEBUG] Validating Google ID token...");
            payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            Console.WriteLine($"[DEBUG] Token validation successful. Subject: {payload.Subject}, Email: {payload.Email}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DEBUG] Token validation failed: {ex.Message}");
            return new AuthResponseDto { Message = "Invalid Google ID token." };
        }

        var sub = payload.Subject;
        var email = payload.Email ?? string.Empty;
        var name = payload.Name ?? string.Empty;
        var picture = payload.Picture;

        Console.WriteLine($"[DEBUG] Extracted from token - Sub: {sub}, Email: {email}, Name: {name}, Picture: {picture}");

        // 1) Prefer lookup by GoogleSubjectId
        Console.WriteLine("[DEBUG] Looking up user by GoogleSubjectId...");
        var user = await _userRepository.GetUserByGoogleSubjectIdAsync(sub);
        Console.WriteLine($"[DEBUG] User found by GoogleSubjectId: {user != null}");

        // 2) If not found, link by matching email
        if (user == null && !string.IsNullOrEmpty(email))
        {
            Console.WriteLine("[DEBUG] User not found by GoogleSubjectId, trying email lookup...");
            user = await _userRepository.GetUserByEmailAsync(email);
            if (user != null)
            {
                Console.WriteLine("[DEBUG] User found by email, linking GoogleSubjectId...");
                user.GoogleSubjectId = sub;
                user.EmailConfirmed = true;
                if (!string.IsNullOrEmpty(picture))
                {
                    user.AvatarUrl = picture;
                }
                _userRepository.Update(user);
                await _userRepository.SaveChangesAsync();
                Console.WriteLine("[DEBUG] User linked successfully.");
            }
            else
            {
                Console.WriteLine("[DEBUG] User not found by email.");
            }
        }

        // 3) If still not found, create a new user
        if (user == null)
        {
            Console.WriteLine("[DEBUG] Creating new user...");
            // Parse first/last name from full name
            var firstName = name;
            var lastName = string.Empty;
            if (!string.IsNullOrWhiteSpace(name))
            {
                var parts = name.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
                firstName = parts.Length > 0 ? parts[0] : name;
                lastName = parts.Length > 1 ? parts[1] : string.Empty;
            }

            // Derive a unique username
            var baseUsername = !string.IsNullOrEmpty(email) && email.Contains('@')
                ? email.Split('@')[0]
                : (firstName + lastName).Trim();
            if (string.IsNullOrWhiteSpace(baseUsername)) baseUsername = "user";
            Console.WriteLine($"[DEBUG] Generating unique username from base: {baseUsername}");
            var uniqueUsername = await _userRepository.GenerateUniqueUsernameAsync(baseUsername);

            user = new User
            {
                Email = email,
                UserName = uniqueUsername,
                FirstName = firstName,
                LastName = lastName,
                AvatarUrl = !string.IsNullOrEmpty(picture) ? picture : "/avatar/MindNestLogoLight.png",
                EmailConfirmed = true,
                GoogleSubjectId = sub,
                IsProfileComplete = false
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();
            Console.WriteLine($"[DEBUG] New user created with ID: {user.Id}, Username: {user.UserName}");
        }

        Console.WriteLine($"[DEBUG] Generating JWT token for user: {user.UserName}");
        var token = GenerateJwtToken(user);
        Console.WriteLine($"[DEBUG] JWT token generated successfully. Returning response.");

        return new AuthResponseDto
        {
            Token = token,
            Message = "Login successful.",
            Username = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            AvatarUrl = user.AvatarUrl,
            IsProfileComplete = user.IsProfileComplete

        };

    }

}