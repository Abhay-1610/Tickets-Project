using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketsProject.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Navigations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CustomerId",
                table: "Tickets",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "SenderId",
                table: "TicketMessages",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AgentId",
                table: "TicketAgents",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_CustomerId",
                table: "Tickets",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketMessages_SenderId",
                table: "TicketMessages",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketMessages_TicketId",
                table: "TicketMessages",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketMessageAttachments_MessageId",
                table: "TicketMessageAttachments",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketAgents_AgentId",
                table: "TicketAgents",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketAgents_TicketId",
                table: "TicketAgents",
                column: "TicketId");

            migrationBuilder.AddForeignKey(
                name: "FK_TicketAgents_AspNetUsers_AgentId",
                table: "TicketAgents",
                column: "AgentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketAgents_Tickets_TicketId",
                table: "TicketAgents",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketMessageAttachments_TicketMessages_MessageId",
                table: "TicketMessageAttachments",
                column: "MessageId",
                principalTable: "TicketMessages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketMessages_AspNetUsers_SenderId",
                table: "TicketMessages",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketMessages_Tickets_TicketId",
                table: "TicketMessages",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_AspNetUsers_CustomerId",
                table: "Tickets",
                column: "CustomerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketAgents_AspNetUsers_AgentId",
                table: "TicketAgents");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketAgents_Tickets_TicketId",
                table: "TicketAgents");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketMessageAttachments_TicketMessages_MessageId",
                table: "TicketMessageAttachments");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketMessages_AspNetUsers_SenderId",
                table: "TicketMessages");

            migrationBuilder.DropForeignKey(
                name: "FK_TicketMessages_Tickets_TicketId",
                table: "TicketMessages");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_AspNetUsers_CustomerId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_CustomerId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_TicketMessages_SenderId",
                table: "TicketMessages");

            migrationBuilder.DropIndex(
                name: "IX_TicketMessages_TicketId",
                table: "TicketMessages");

            migrationBuilder.DropIndex(
                name: "IX_TicketMessageAttachments_MessageId",
                table: "TicketMessageAttachments");

            migrationBuilder.DropIndex(
                name: "IX_TicketAgents_AgentId",
                table: "TicketAgents");

            migrationBuilder.DropIndex(
                name: "IX_TicketAgents_TicketId",
                table: "TicketAgents");

            migrationBuilder.AlterColumn<string>(
                name: "CustomerId",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "SenderId",
                table: "TicketMessages",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AgentId",
                table: "TicketAgents",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
