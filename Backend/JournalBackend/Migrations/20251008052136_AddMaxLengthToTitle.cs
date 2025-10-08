using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JournalBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddMaxLengthToTitle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_JournalEntries_UserId",
                table: "JournalEntries");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "JournalEntries",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntries_UserId_Title",
                table: "JournalEntries",
                columns: new[] { "UserId", "Title" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_JournalEntries_UserId_Title",
                table: "JournalEntries");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "JournalEntries",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.CreateIndex(
                name: "IX_JournalEntries_UserId",
                table: "JournalEntries",
                column: "UserId");
        }
    }
}
