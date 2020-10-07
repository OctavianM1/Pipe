using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
  public partial class Follows : Migration
  {

    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
                    name: "Follows",
                    columns: table => new
                    {
                      Id = table.Column<Guid>(nullable: false),
                      UserId = table.Column<Guid>(nullable: false),
                      FollowerId = table.Column<Guid>(nullable: false),
                    },
                    constraints: table =>
                    {
                      table.PrimaryKey("PK_Activities", x => x.Id);
                      table.ForeignKey("FK_Users", x => x.UserId, "Users", "Id");
                      table.ForeignKey("FK_Users", x => x.FollowerId, "Users", "Id");
                    });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable("Follows");
    }
  }
}
