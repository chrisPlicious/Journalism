using JournalBackend.Models;

namespace JournalBackend.Repositories.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByUsernameAsync(string username);
    Task<User?> GetUserByEmailOrUsernameAsync(string identifier);
    Task<User?> GetUserByGoogleSubjectIdAsync(string googleSubjectId);
    Task<bool> IsUsernameTakenAsync(string username);
    Task<bool> IsEmailTakenAsync(string email);
    Task<string> GenerateUniqueUsernameAsync(string baseUsername);
}