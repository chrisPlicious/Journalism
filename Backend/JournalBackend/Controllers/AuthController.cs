// OOP Pillars: Encapsulation (private methods), Abstraction (public actions hide logic).
// SOLID: Single Responsibility - Handle auth HTTP requests.

using JournalBackend.DTOs;
using JournalBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace JournalBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
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
}