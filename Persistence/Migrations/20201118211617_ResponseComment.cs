using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class ResponseComment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CommentResponse",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    ParentActivityCommentId = table.Column<Guid>(nullable: false),
                    Comment = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommentResponse", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CommentResponse_ActivityComments_ParentActivityCommentId",
                        column: x => x.ParentActivityCommentId,
                        principalTable: "ActivityComments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CommentResponseLikes",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    CommentResponseId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommentResponseLikes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CommentResponseLikes_CommentResponse_CommentResponseId",
                        column: x => x.CommentResponseId,
                        principalTable: "CommentResponse",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CommentResponseLikes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CommentResponse_ParentActivityCommentId",
                table: "CommentResponse",
                column: "ParentActivityCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_CommentResponseLikes_CommentResponseId",
                table: "CommentResponseLikes",
                column: "CommentResponseId");

            migrationBuilder.CreateIndex(
                name: "IX_CommentResponseLikes_UserId",
                table: "CommentResponseLikes",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CommentResponseLikes");

            migrationBuilder.DropTable(
                name: "CommentResponse");
        }
    }
}
