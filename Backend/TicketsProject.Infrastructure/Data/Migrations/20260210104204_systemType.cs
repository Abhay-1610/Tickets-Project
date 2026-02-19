using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketsProject.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class systemType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SystemType",
                table: "TicketMessages",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SystemType",
                table: "TicketMessages");
        }
    }
}
