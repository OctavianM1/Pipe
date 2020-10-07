using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
  public partial class CommentLikes : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
                                name: "CommentLikes",
                                columns: table => new
                                {
                                  Id = table.Column<Guid>(nullable: false),
                                  UserId = table.Column<Guid>(nullable: false),
                                  CommentId = table.Column<Guid>(nullable: false),
                                },
                                constraints: table =>
                                {
                                  table.PrimaryKey("PK_Activities", x => x.Id);
                                  table.ForeignKey("FK_Users", x => x.UserId, "Users", "Id");
                                  table.ForeignKey("FK_Comments", x => x.CommentId, "ActivityComments", "Id");
                                });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable("CommentLikes");
    }
  }
}
