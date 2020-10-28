using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class SearchActivities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SearchActivities",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserHostId = table.Column<Guid>(nullable: false),
                    UserVisitorId = table.Column<Guid>(nullable: false),
                    Input = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SearchActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SearchActivities_Users_UserHostId",
                        column: x => x.UserHostId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SearchActivities_Users_UserVisitorId",
                        column: x => x.UserVisitorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SearchActivities_UserHostId",
                table: "SearchActivities",
                column: "UserHostId");

            migrationBuilder.CreateIndex(
                name: "IX_SearchActivities_UserVisitorId",
                table: "SearchActivities",
                column: "UserVisitorId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SearchActivities");
        }
    }
}
