using AutoMapper;
using JournalBackend.DTOs;
using JournalBackend.Models;
using JournalBackend.Profiles;
using JournalBackend.Repositories.Interfaces;
using JournalBackend.Services.Implementations;
using Moq;

namespace JournalBackend.Tests;

public class JournalServiceTests
{
    private readonly Mock<IJournalEntryRepository> _mockRepo;
    private readonly IMapper _mapper;
    private readonly JournalService _service;
    private const string TestUserId = "test-user-id";

    public JournalServiceTests()
    {
        _mockRepo = new Mock<IJournalEntryRepository>();

        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<JournalMappingProfile>();
        });
        _mapper = mapperConfig.CreateMapper();

        _service = new JournalService(_mockRepo.Object, _mapper);
    }

    // --- Pin limit (max 3) ---

    [Fact]
    public async Task TogglePin_WhenAlreadyThreePinned_ThrowsInvalidOperation()
    {
        var entry = new JournalEntry { Id = 4, Title = "Entry 4", UserId = TestUserId, IsPinned = false, Category = "work", Content = "c" };

        _mockRepo
            .Setup(r => r.GetEntryByIdAndUserIdAsync(4, TestUserId))
            .ReturnsAsync(entry);

        _mockRepo
            .Setup(r => r.CountPinnedEntriesAsync(TestUserId))
            .ReturnsAsync(3);

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _service.TogglePinAsync(4, TestUserId));

        Assert.Equal("You can only pin up to 3 journal entries.", ex.Message);
    }

    [Fact]
    public async Task TogglePin_WhenUnderLimit_PinsSuccessfully()
    {
        var entry = new JournalEntry { Id = 1, Title = "Entry 1", UserId = TestUserId, IsPinned = false, Category = "work", Content = "c" };

        _mockRepo
            .Setup(r => r.GetEntryByIdAndUserIdAsync(1, TestUserId))
            .ReturnsAsync(entry);

        _mockRepo
            .Setup(r => r.CountPinnedEntriesAsync(TestUserId))
            .ReturnsAsync(2);

        var result = await _service.TogglePinAsync(1, TestUserId);

        Assert.NotNull(result);
        Assert.True(result!.IsPinned);
        _mockRepo.Verify(r => r.Update(It.Is<JournalEntry>(e => e.IsPinned == true)), Times.Once);
        _mockRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task TogglePin_WhenAlreadyPinned_UnpinsSuccessfully()
    {
        var entry = new JournalEntry { Id = 1, Title = "Entry 1", UserId = TestUserId, IsPinned = true, Category = "work", Content = "c" };

        _mockRepo
            .Setup(r => r.GetEntryByIdAndUserIdAsync(1, TestUserId))
            .ReturnsAsync(entry);

        var result = await _service.TogglePinAsync(1, TestUserId);

        Assert.NotNull(result);
        Assert.False(result!.IsPinned);
        _mockRepo.Verify(r => r.Update(It.Is<JournalEntry>(e => e.IsPinned == false)), Times.Once);
    }

    [Fact]
    public async Task TogglePin_EntryNotFound_ReturnsNull()
    {
        _mockRepo
            .Setup(r => r.GetEntryByIdAndUserIdAsync(999, TestUserId))
            .ReturnsAsync((JournalEntry?)null);

        var result = await _service.TogglePinAsync(999, TestUserId);

        Assert.Null(result);
    }

    // --- Title uniqueness ---

    [Fact]
    public async Task CreateEntry_DuplicateTitle_ThrowsInvalidOperation()
    {
        var dto = new JournalEntryCreateDto { Title = "My Title", Category = "work", Content = "Content" };

        _mockRepo
            .Setup(r => r.IsTitleTakenByUserAsync("My Title", TestUserId))
            .ReturnsAsync(true);

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _service.CreateEntryAsync(dto, TestUserId));

        Assert.Equal("A journal entry with this title already exists.", ex.Message);
    }

    [Fact]
    public async Task CreateEntry_UniqueTitle_Succeeds()
    {
        var dto = new JournalEntryCreateDto { Title = "Unique Title", Category = "personal", Content = "My content" };

        _mockRepo
            .Setup(r => r.IsTitleTakenByUserAsync("Unique Title", TestUserId))
            .ReturnsAsync(false);

        var result = await _service.CreateEntryAsync(dto, TestUserId);

        Assert.NotNull(result);
        Assert.Equal("Unique Title", result.Title);
        Assert.Equal("personal", result.Category);
        Assert.Equal("My content", result.Content);
        _mockRepo.Verify(r => r.AddAsync(It.IsAny<JournalEntry>()), Times.Once);
        _mockRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    // --- Create entry returns correct DTO ---

    [Fact]
    public async Task CreateEntry_ReturnsCorrectDetailDto()
    {
        var dto = new JournalEntryCreateDto { Title = "Test", Category = "study", Content = "Study notes" };

        _mockRepo
            .Setup(r => r.IsTitleTakenByUserAsync("Test", TestUserId))
            .ReturnsAsync(false);

        var result = await _service.CreateEntryAsync(dto, TestUserId);

        Assert.IsType<JournalEntryDetailDto>(result);
        Assert.Equal("Test", result.Title);
        Assert.Equal("study", result.Category);
        Assert.Equal("Study notes", result.Content);
    }

    // --- Delete entry for wrong user ---

    [Fact]
    public async Task DeleteEntry_WrongUser_ReturnsFalse()
    {
        _mockRepo
            .Setup(r => r.GetEntryByIdAndUserIdAsync(1, "other-user"))
            .ReturnsAsync((JournalEntry?)null);

        var result = await _service.DeleteEntryAsync(1, "other-user");

        Assert.False(result);
        _mockRepo.Verify(r => r.Remove(It.IsAny<JournalEntry>()), Times.Never);
    }

    [Fact]
    public async Task DeleteEntry_CorrectUser_ReturnsTrue()
    {
        var entry = new JournalEntry { Id = 1, Title = "Entry", UserId = TestUserId, Category = "work", Content = "c" };

        _mockRepo
            .Setup(r => r.GetEntryByIdAndUserIdAsync(1, TestUserId))
            .ReturnsAsync(entry);

        var result = await _service.DeleteEntryAsync(1, TestUserId);

        Assert.True(result);
        _mockRepo.Verify(r => r.Remove(entry), Times.Once);
        _mockRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    // --- ToggleFavorite ---

    [Fact]
    public async Task ToggleFavorite_ToggleOn_SetsIsFavoriteTrue()
    {
        var entry = new JournalEntry { Id = 1, Title = "Entry", UserId = TestUserId, IsFavorite = false, Category = "work", Content = "c" };

        _mockRepo
            .Setup(r => r.GetEntryByIdAndUserIdAsync(1, TestUserId))
            .ReturnsAsync(entry);

        var result = await _service.ToggleFavoriteAsync(1, TestUserId);

        Assert.NotNull(result);
        Assert.True(result!.IsFavorite);
    }

    [Fact]
    public async Task ToggleFavorite_ToggleOff_SetsIsFavoriteFalse()
    {
        var entry = new JournalEntry { Id = 1, Title = "Entry", UserId = TestUserId, IsFavorite = true, Category = "work", Content = "c" };

        _mockRepo
            .Setup(r => r.GetEntryByIdAndUserIdAsync(1, TestUserId))
            .ReturnsAsync(entry);

        var result = await _service.ToggleFavoriteAsync(1, TestUserId);

        Assert.NotNull(result);
        Assert.False(result!.IsFavorite);
    }

    [Fact]
    public async Task ToggleFavorite_EntryNotFound_ReturnsNull()
    {
        _mockRepo
            .Setup(r => r.GetEntryByIdAndUserIdAsync(999, TestUserId))
            .ReturnsAsync((JournalEntry?)null);

        var result = await _service.ToggleFavoriteAsync(999, TestUserId);

        Assert.Null(result);
    }

    // --- GetEntryById ---

    [Fact]
    public async Task GetEntryById_ExistingEntry_ReturnsDetailDto()
    {
        var entry = new JournalEntry
        {
            Id = 1, Title = "Test Entry", UserId = TestUserId,
            Category = "work", Content = "Test content",
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };

        _mockRepo
            .Setup(r => r.GetEntryByIdAndUserIdAsync(1, TestUserId))
            .ReturnsAsync(entry);

        var result = await _service.GetEntryByIdAsync(1, TestUserId);

        Assert.NotNull(result);
        Assert.Equal("Test Entry", result!.Title);
        Assert.Equal("work", result.Category);
    }

    [Fact]
    public async Task GetEntryById_NonExistentEntry_ReturnsNull()
    {
        _mockRepo
            .Setup(r => r.GetEntryByIdAndUserIdAsync(999, TestUserId))
            .ReturnsAsync((JournalEntry?)null);

        var result = await _service.GetEntryByIdAsync(999, TestUserId);

        Assert.Null(result);
    }
}
