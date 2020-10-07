using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
  public partial class ActivityComments : Migration
  {

    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
              name: "ActivityComments",
              columns: table => new
              {
                Id = table.Column<Guid>(nullable: false),
                UserId = table.Column<Guid>(nullable: false),
                ActivityId = table.Column<Guid>(nullable: false),
                Comment = table.Column<string>(nullable: true),
                DateTimeCreated = table.Column<DateTime>(nullable: true),
                DateTimeEdited = table.Column<DateTime>(nullable: true),
              },
              constraints: table =>
              {
                table.PrimaryKey("PK_Activities", x => x.Id);
                table.ForeignKey("FK_Users", x => x.UserId, "Users", "Id");
                table.ForeignKey("FK_Activities", x => x.ActivityId, "Activities", "Id");
              });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable("ActivityComments");
    }
  }
}
