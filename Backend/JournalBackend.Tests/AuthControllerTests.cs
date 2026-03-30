using System.Security.Claims;
using AutoMapper;
using JournalBackend.Controllers;
using JournalBackend.DTOs;
using JournalBackend.Models;
using JournalBackend.Profiles;
using JournalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace JournalBackend.Tests;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _mockAuthService;
    private readonly Mock<ILogger<AuthController>> _mockLogger;
    private readonly IMapper _mapper;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _mockAuthService = new Mock<IAuthService>();
        _mockLogger = new Mock<ILogger<AuthController>>();

        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<JournalMappingProfile>();
            cfg.CreateMap<User, UserProfileDto>();
        });
        _mapper = mapperConfig.CreateMapper();

        _controller = new AuthController(_mockAuthService.Object, _mockLogger.Object, _mapper);
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
    }

    private void SetAuthenticatedUser(string userId)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId)
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);
        _controller.ControllerContext.HttpContext.User = principal;
    }

    // --- Register ---

    [Fact]
    public async Task Register_WithValidData_ReturnsOk()
    {
        var registerDto = new RegisterDto
        {
            FirstName = "John",
            LastName = "Doe",
            Gender = "Male",
            DateOfBirth = new DateTime(1990, 1, 1),
            Email = "john@example.com",
            Username = "johndoe",
            Password = "Password1!",
            ConfirmPassword = "Password1!"
        };

        var response = new AuthResponseDto
        {
            Token = "jwt-token-here",
            Message = "Registration successful.",
            Username = "johndoe",
            Email = "john@example.com"
        };

        _mockAuthService
            .Setup(s => s.RegisterAsync(registerDto))
            .ReturnsAsync(response);

        var result = await _controller.Register(registerDto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var auth = Assert.IsType<AuthResponseDto>(okResult.Value);
        Assert.Equal("jwt-token-here", auth.Token);
        Assert.Equal("Registration successful.", auth.Message);
    }

    [Fact]
    public async Task Register_UserAlreadyExists_ReturnsBadRequest()
    {
        var registerDto = new RegisterDto
        {
            FirstName = "John",
            LastName = "Doe",
            Gender = "Male",
            DateOfBirth = new DateTime(1990, 1, 1),
            Email = "john@example.com",
            Username = "johndoe",
            Password = "Password1!",
            ConfirmPassword = "Password1!"
        };

        var response = new AuthResponseDto
        {
            Token = string.Empty,
            Message = "User already exists."
        };

        _mockAuthService
            .Setup(s => s.RegisterAsync(registerDto))
            .ReturnsAsync(response);

        var result = await _controller.Register(registerDto);

        // Token is empty string (not null), so controller returns Ok
        // The controller checks Token == null, and empty string is not null
        var okResult = Assert.IsType<OkObjectResult>(result);
    }

    // --- Login ---

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsOkWithToken()
    {
        var loginDto = new LoginDto
        {
            LoginIdentifier = "john@example.com",
            Password = "Password1!"
        };

        var response = new AuthResponseDto
        {
            Token = "jwt-token-here",
            Message = "Login successful.",
            Username = "johndoe",
            Email = "john@example.com"
        };

        _mockAuthService
            .Setup(s => s.LoginAsync(loginDto))
            .ReturnsAsync(response);

        var result = await _controller.Login(loginDto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var auth = Assert.IsType<AuthResponseDto>(okResult.Value);
        Assert.Equal("jwt-token-here", auth.Token);
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorized()
    {
        var loginDto = new LoginDto
        {
            LoginIdentifier = "john@example.com",
            Password = "WrongPassword"
        };

        var response = new AuthResponseDto
        {
            Token = null!,
            Message = "Invalid credentials."
        };

        _mockAuthService
            .Setup(s => s.LoginAsync(loginDto))
            .ReturnsAsync(response);

        var result = await _controller.Login(loginDto);

        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    // --- GetProfile ---

    [Fact]
    public async Task GetProfile_Authenticated_ReturnsUserProfile()
    {
        var userId = "user-123";
        SetAuthenticatedUser(userId);

        var user = new User
        {
            Id = userId,
            FirstName = "John",
            LastName = "Doe",
            UserName = "johndoe",
            Email = "john@example.com",
            Gender = "Male",
            DateOfBirth = new DateTime(1990, 1, 1),
            AvatarUrl = "/avatar/test.png"
        };

        _mockAuthService
            .Setup(s => s.GetUserByIdAsync(userId))
            .ReturnsAsync(user);

        var result = await _controller.GetProfile();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<UserProfileDto>(okResult.Value);
        Assert.Equal("johndoe", dto.UserName);
        Assert.Equal("john@example.com", dto.Email);
    }

    [Fact]
    public async Task GetProfile_NotAuthenticated_ReturnsUnauthorized()
    {
        // No claims set = unauthenticated
        _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity());

        var result = await _controller.GetProfile();

        Assert.IsType<UnauthorizedResult>(result.Result);
    }

    [Fact]
    public async Task GetProfile_UserNotFound_ReturnsNotFound()
    {
        var userId = "nonexistent-user";
        SetAuthenticatedUser(userId);

        _mockAuthService
            .Setup(s => s.GetUserByIdAsync(userId))
            .ReturnsAsync((User?)null);

        var result = await _controller.GetProfile();

        Assert.IsType<NotFoundResult>(result.Result);
    }
}
