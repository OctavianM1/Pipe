using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
  public partial class ActivityRaiting : Migration
  {

    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
                    name: "ActivityRaiting",
                    columns: table => new
                    {
                      Id = table.Column<Guid>(nullable: false),
                      UserId = table.Column<Guid>(nullable: false),
                      ActivityId = table.Column<Guid>(nullable: false),
                      Raiting = table.Column<float>(nullable: true),
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
      migrationBuilder.DropTable("ActivityRaiting");
    }
  }
}
