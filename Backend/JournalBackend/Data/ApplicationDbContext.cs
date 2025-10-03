// OOP: This class is a DbContext, managing database interactions.
// OOP Pillars: Inheritance (from IdentityDbContext<User>), Encapsulation (DbSet properties).
// SOLID: Single Responsibility - Database context management.
// LINQ: Used in queries via Entity Framework.

using JournalBackend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace JournalBackend.Data;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<JournalEntry> JournalEntries { get; set; }
}