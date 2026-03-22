using System.Security.Claims;
using JournalBackend.Controllers;
using JournalBackend.DTOs;
using JournalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace JournalBackend.Tests;

public class JournalControllerTests
{
    private readonly Mock<IJournalService> _mockJournalService;
    private readonly JournalController _controller;
    private const string TestUserId = "test-user-id";

    public JournalControllerTests()
    {
        _mockJournalService = new Mock<IJournalService>();
        _controller = new JournalController(_mockJournalService.Object);
        SetAuthenticatedUser(_controller, TestUserId);
    }

    private static void SetAuthenticatedUser(ControllerBase controller, string userId)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId)
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };
    }

    // --- GetAllEntries ---

    [Fact]
    public async Task GetAllEntries_ReturnsOkWithPaginatedEntries()
    {
        var response = new PaginatedResponse<JournalEntryDto>
        {
            Items = new List<JournalEntryDto>
            {
                new() { Id = 1, Title = "Entry 1", Category = "work", Content = "Content 1" },
                new() { Id = 2, Title = "Entry 2", Category = "personal", Content = "Content 2" }
            },
            TotalCount = 2,
            Page = 1,
            PageSize = 20
        };

        _mockJournalService
            .Setup(s => s.GetAllEntriesAsync(TestUserId, null, 1, 20))
            .ReturnsAsync(response);

        var result = await _controller.GetAllEntries(null, 1, 20);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsType<PaginatedResponse<JournalEntryDto>>(okResult.Value);
        Assert.Equal(2, returned.TotalCount);
        Assert.Equal(2, returned.Items.Count());
    }

    [Fact]
    public async Task GetAllEntries_WithPinnedFilter_PassesFilterToService()
    {
        var response = new PaginatedResponse<JournalEntryDto>
        {
            Items = new List<JournalEntryDto>
            {
                new() { Id = 2, Title = "Entry 2", IsPinned = true }
            },
            TotalCount = 1,
            Page = 1,
            PageSize = 20
        };

        _mockJournalService
            .Setup(s => s.GetAllEntriesAsync(TestUserId, "pinned", 1, 20))
            .ReturnsAsync(response);

        var result = await _controller.GetAllEntries("pinned", 1, 20);

        var okResult = Assert.IsType<OkObjectResult>(result);
        _mockJournalService.Verify(s => s.GetAllEntriesAsync(TestUserId, "pinned", 1, 20), Times.Once);
    }

    [Fact]
    public async Task GetAllEntries_WithFavoritesFilter_PassesFilterToService()
    {
        var response = new PaginatedResponse<JournalEntryDto>
        {
            Items = new List<JournalEntryDto>
            {
                new() { Id = 1, Title = "Entry 1", IsFavorite = true }
            },
            TotalCount = 1,
            Page = 1,
            PageSize = 20
        };

        _mockJournalService
            .Setup(s => s.GetAllEntriesAsync(TestUserId, "favorites", 1, 20))
            .ReturnsAsync(response);

        var result = await _controller.GetAllEntries("favorites", 1, 20);

        var okResult = Assert.IsType<OkObjectResult>(result);
        _mockJournalService.Verify(s => s.GetAllEntriesAsync(TestUserId, "favorites", 1, 20), Times.Once);
    }

    // --- CreateEntry ---

    [Fact]
    public async Task CreateEntry_WithDuplicateTitle_ReturnsBadRequest()
    {
        var dto = new JournalEntryCreateDto { Title = "Duplicate", Category = "work", Content = "Some content" };

        _mockJournalService
            .Setup(s => s.CreateEntryAsync(dto, TestUserId))
            .ThrowsAsync(new InvalidOperationException("A journal entry with this title already exists."));

        var result = await _controller.CreateEntry(dto);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badRequest.Value);
    }

    [Fact]
    public async Task CreateEntry_WithValidData_ReturnsCreatedAtAction()
    {
        var dto = new JournalEntryCreateDto { Title = "New Entry", Category = "work", Content = "Content" };
        var created = new JournalEntryDetailDto { Id = 1, Title = "New Entry", Category = "work", Content = "Content" };

        _mockJournalService
            .Setup(s => s.CreateEntryAsync(dto, TestUserId))
            .ReturnsAsync(created);

        var result = await _controller.CreateEntry(dto);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(_controller.GetEntryById), createdResult.ActionName);
    }

    // --- TogglePin ---

    [Fact]
    public async Task TogglePin_EntryExists_ReturnsOkWithToggledEntry()
    {
        var toggled = new JournalEntryDetailDto { Id = 1, Title = "Entry", IsPinned = true };

        _mockJournalService
            .Setup(s => s.TogglePinAsync(1, TestUserId))
            .ReturnsAsync(toggled);

        var result = await _controller.TogglePin(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var entry = Assert.IsType<JournalEntryDetailDto>(okResult.Value);
        Assert.True(entry.IsPinned);
    }

    [Fact]
    public async Task TogglePin_EntryNotFound_ReturnsNotFound()
    {
        _mockJournalService
            .Setup(s => s.TogglePinAsync(999, TestUserId))
            .ReturnsAsync((JournalEntryDetailDto?)null);

        var result = await _controller.TogglePin(999);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task TogglePin_ExceedsPinLimit_ReturnsBadRequest()
    {
        _mockJournalService
            .Setup(s => s.TogglePinAsync(1, TestUserId))
            .ThrowsAsync(new InvalidOperationException("You can only pin up to 3 journal entries."));

        var result = await _controller.TogglePin(1);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    // --- ToggleFavorite ---

    [Fact]
    public async Task ToggleFavorite_EntryExists_ReturnsOkWithToggledEntry()
    {
        var toggled = new JournalEntryDetailDto { Id = 1, Title = "Entry", IsFavorite = true };

        _mockJournalService
            .Setup(s => s.ToggleFavoriteAsync(1, TestUserId))
            .ReturnsAsync(toggled);

        var result = await _controller.ToggleFavorite(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var entry = Assert.IsType<JournalEntryDetailDto>(okResult.Value);
        Assert.True(entry.IsFavorite);
    }

    [Fact]
    public async Task ToggleFavorite_EntryNotFound_ReturnsNotFound()
    {
        _mockJournalService
            .Setup(s => s.ToggleFavoriteAsync(999, TestUserId))
            .ReturnsAsync((JournalEntryDetailDto?)null);

        var result = await _controller.ToggleFavorite(999);

        Assert.IsType<NotFoundResult>(result);
    }

    // --- Unauthorized (no user claim) ---

    [Fact]
    public async Task GetAllEntries_NoUserClaim_PassesEmptyUserId()
    {
        var controller = new JournalController(_mockJournalService.Object);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(new ClaimsIdentity()) }
        };

        var response = new PaginatedResponse<JournalEntryDto>
        {
            Items = new List<JournalEntryDto>(),
            TotalCount = 0,
            Page = 1,
            PageSize = 20
        };

        _mockJournalService
            .Setup(s => s.GetAllEntriesAsync(string.Empty, null, 1, 20))
            .ReturnsAsync(response);

        var result = await controller.GetAllEntries(null, 1, 20);

        Assert.IsType<OkObjectResult>(result);
        _mockJournalService.Verify(s => s.GetAllEntriesAsync(string.Empty, null, 1, 20), Times.Once);
    }
}
