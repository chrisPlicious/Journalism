using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JournalBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddGoogleSubjectId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GoogleSubjectId",
                table: "AspNetUsers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_GoogleSubjectId",
                table: "AspNetUsers",
                column: "GoogleSubjectId",
                unique: true,
                filter: "[GoogleSubjectId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_GoogleSubjectId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "GoogleSubjectId",
                table: "AspNetUsers");
        }
    }
}
