using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
  public partial class Activities : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
        name: "Activities",
        columns: table => new
        {
          Id = table.Column<Guid>(nullable: false),
          UserHostId = table.Column<Guid>(nullable: false),
          Title = table.Column<string>(nullable: true),
          Body = table.Column<string>(nullable: true),
          Subject = table.Column<string>(nullable: true),
          DateTimeCreated = table.Column<DateTime>(nullable: true),
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_Activities", x => x.Id);
          table.ForeignKey("FK_Users", x => x.UserHostId, "Users", "Id");
        });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable("Activities");
    }
  }
}
