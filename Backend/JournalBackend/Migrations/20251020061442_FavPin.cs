using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JournalBackend.Migrations
{
    /// <inheritdoc />
    public partial class FavPin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFavorite",
                table: "JournalEntries",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPinned",
                table: "JournalEntries",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFavorite",
                table: "JournalEntries");

            migrationBuilder.DropColumn(
                name: "IsPinned",
                table: "JournalEntries");
        }
    }
}
