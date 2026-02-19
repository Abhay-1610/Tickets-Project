using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketsProject.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomerResolutionConfirmation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CustomerConfirmedResolution",
                table: "Tickets",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomerConfirmedResolution",
                table: "Tickets");
        }
    }
}
