using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class Notify : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notify",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    NotifierUserId = table.Column<Guid>(nullable: false),
                    ObervableUserId = table.Column<Guid>(nullable: false),
                    Message = table.Column<string>(nullable: true),
                    DateTimeCreated = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notify", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notify_Users_NotifierUserId",
                        column: x => x.NotifierUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notify_Users_ObervableUserId",
                        column: x => x.ObervableUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notify_NotifierUserId",
                table: "Notify",
                column: "NotifierUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notify_ObervableUserId",
                table: "Notify",
                column: "ObervableUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notify");
        }
    }
}
