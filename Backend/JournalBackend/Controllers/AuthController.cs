// OOP Pillars: Encapsulation (private methods), Abstraction (public actions hide logic).
// SOLID: Single Responsibility - Handle auth HTTP requests.

using JournalBackend.DTOs;
using JournalBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace JournalBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.RegisterAsync(registerDto);
        if (result.Token == null)
            return BadRequest(result.Message);

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.LoginAsync(loginDto);
        if (result.Token == null)
            return Unauthorized(result.Message);

        return Ok(result);
    }

     [HttpGet("{id}")]
        public async Task<ActionResult<UserProfileDto>> GetUserById(string id)
        {
            _logger.LogInformation("Attempting to get user by id: {Id}", id);
            var user = await _authService.GetUserByIdAsync(id);
            if (user == null)
            {
                _logger.LogWarning("User with id {Id} not found", id);
                return NotFound();
            }

            _logger.LogInformation("User found: {UserName}", user.UserName);

            // ✅ Mapping directly inside controller
            var dto = new UserProfileDto
            {
                Id = user.Id,
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth,
                AvatarUrl = user.AvatarUrl
            };

            return Ok(dto);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _authService.LogoutAsync();
            return Ok();

        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            _logger.LogInformation("GetProfile called. IsAuthenticated: {Auth}", User.Identity?.IsAuthenticated);
            _logger.LogInformation("Claims: {Claims}", string.Join(", ", User.Claims.Select(c => $"{c.Type}: {c.Value}")));
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("User ID not found in token");
                return Unauthorized();
            }

            _logger.LogInformation("Getting profile for user: {UserId}", userId);
            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User not found: {UserId}", userId);
                return NotFound();
            }

            var dto = new UserProfileDto
            {
                Id = user.Id,
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth,
                AvatarUrl = user.AvatarUrl
            };

            return Ok(dto);
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<ActionResult<UserProfileDto>> UpdateProfile([FromBody] UserProfileUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("User ID not found in token");
                return Unauthorized();
            }

            _logger.LogInformation("Updating profile for user: {UserId}", userId);
            var updatedUser = await _authService.UpdateUserProfileAsync(userId, updateDto);
            if (updatedUser == null)
            {
                _logger.LogWarning("User not found for update: {UserId}", userId);
                return NotFound();
            }

            var dto = new UserProfileDto
            {
                Id = updatedUser.Id,
                UserName = updatedUser.UserName ?? string.Empty,
                Email = updatedUser.Email ?? string.Empty,
                FirstName = updatedUser.FirstName,
                LastName = updatedUser.LastName,
                Gender = updatedUser.Gender,
                DateOfBirth = updatedUser.DateOfBirth,
                AvatarUrl = updatedUser.AvatarUrl
            };

            return Ok(dto);
        }

        [AllowAnonymous]
        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.IdToken))
                return BadRequest("Missing Google ID token.");

            var result = await _authService.GoogleSignInAsync(dto.IdToken);
            if (string.IsNullOrEmpty(result.Token))
                return Unauthorized(result.Message);

            return Ok(result);
        }
}