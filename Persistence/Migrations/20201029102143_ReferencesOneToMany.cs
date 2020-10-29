using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class ReferencesOneToMany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Password = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    CountFollowers = table.Column<int>(nullable: false),
                    CountFollowing = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Activities",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserHostId = table.Column<Guid>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Body = table.Column<string>(nullable: true),
                    Subject = table.Column<string>(nullable: true),
                    DateTimeCreated = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Activities_Users_UserHostId",
                        column: x => x.UserHostId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Follows",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    FollowerId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Follows", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Follows_Users_FollowerId",
                        column: x => x.FollowerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Follows_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateTable(
                name: "SearchAllUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    Input = table.Column<string>(maxLength: 50, nullable: false),
                    DateTimeCreated = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SearchAllUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SearchAllUsers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SearchFollowingUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    Input = table.Column<string>(maxLength: 50, nullable: false),
                    DateTimeCreated = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SearchFollowingUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SearchFollowingUsers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SearchFollowsUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    Input = table.Column<string>(maxLength: 50, nullable: false),
                    DateTimeCreated = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SearchFollowsUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SearchFollowsUsers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActivityComments",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    ActivityId = table.Column<Guid>(nullable: false),
                    Comment = table.Column<string>(nullable: true),
                    DateTimeCreated = table.Column<string>(nullable: true),
                    DateTimeEdited = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActivityComments_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActivityComments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActivityLikes",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    ActivityId = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityLikes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActivityLikes_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActivityLikes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActivityRaiting",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    ActivityId = table.Column<Guid>(nullable: false),
                    Raiting = table.Column<float>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityRaiting", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActivityRaiting_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActivityRaiting_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CommentLikes",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    ActivityId = table.Column<Guid>(nullable: false),
                    ActivityCommentId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommentLikes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CommentLikes_ActivityComments_ActivityCommentId",
                        column: x => x.ActivityCommentId,
                        principalTable: "ActivityComments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CommentLikes_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CommentLikes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Activities_UserHostId",
                table: "Activities",
                column: "UserHostId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityComments_ActivityId",
                table: "ActivityComments",
                column: "ActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityComments_UserId",
                table: "ActivityComments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLikes_ActivityId",
                table: "ActivityLikes",
                column: "ActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLikes_UserId",
                table: "ActivityLikes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityRaiting_ActivityId",
                table: "ActivityRaiting",
                column: "ActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityRaiting_UserId",
                table: "ActivityRaiting",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CommentLikes_ActivityCommentId",
                table: "CommentLikes",
                column: "ActivityCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_CommentLikes_ActivityId",
                table: "CommentLikes",
                column: "ActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_CommentLikes_UserId",
                table: "CommentLikes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Follows_FollowerId",
                table: "Follows",
                column: "FollowerId");

            migrationBuilder.CreateIndex(
                name: "IX_Follows_UserId",
                table: "Follows",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SearchActivities_UserHostId",
                table: "SearchActivities",
                column: "UserHostId");

            migrationBuilder.CreateIndex(
                name: "IX_SearchActivities_UserVisitorId",
                table: "SearchActivities",
                column: "UserVisitorId");

            migrationBuilder.CreateIndex(
                name: "IX_SearchAllUsers_UserId",
                table: "SearchAllUsers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SearchFollowingUsers_UserId",
                table: "SearchFollowingUsers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SearchFollowsUsers_UserId",
                table: "SearchFollowsUsers",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityLikes");

            migrationBuilder.DropTable(
                name: "ActivityRaiting");

            migrationBuilder.DropTable(
                name: "CommentLikes");

            migrationBuilder.DropTable(
                name: "Follows");

            migrationBuilder.DropTable(
                name: "SearchActivities");

            migrationBuilder.DropTable(
                name: "SearchAllUsers");

            migrationBuilder.DropTable(
                name: "SearchFollowingUsers");

            migrationBuilder.DropTable(
                name: "SearchFollowsUsers");

            migrationBuilder.DropTable(
                name: "ActivityComments");

            migrationBuilder.DropTable(
                name: "Activities");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
