using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class NewResponseComment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "CommentResponse",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_CommentResponse_UserId",
                table: "CommentResponse",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_CommentResponse_Users_UserId",
                table: "CommentResponse",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CommentResponse_Users_UserId",
                table: "CommentResponse");

            migrationBuilder.DropIndex(
                name: "IX_CommentResponse_UserId",
                table: "CommentResponse");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "CommentResponse");
        }
    }
}
