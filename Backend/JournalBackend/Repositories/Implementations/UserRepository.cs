using JournalBackend.Data;
using JournalBackend.Models;
using JournalBackend.Repositories.Interfaces;

namespace JournalBackend.Repositories.Implementations;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await FirstOrDefaultAsync(u => u.UserName == username);
    }

    public async Task<User?> GetUserByEmailOrUsernameAsync(string identifier)
    {
        return await FirstOrDefaultAsync(u => u.Email == identifier || u.UserName == identifier);
    }

    public async Task<User?> GetUserByGoogleSubjectIdAsync(string googleSubjectId)
    {
        return await FirstOrDefaultAsync(u => u.GoogleSubjectId == googleSubjectId);
    }

    public async Task<bool> IsUsernameTakenAsync(string username)
    {
        return await AnyAsync(u => u.UserName == username);
    }

    public async Task<bool> IsEmailTakenAsync(string email)
    {
        return await AnyAsync(u => u.Email == email);
    }

    public async Task<string> GenerateUniqueUsernameAsync(string baseUsername)
    {
        var username = baseUsername;
        var suffix = 0;
        while (await IsUsernameTakenAsync(username))
        {
            suffix++;
            username = $"{baseUsername}{suffix}";
        }
        return username;
    }
}