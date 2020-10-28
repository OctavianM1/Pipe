using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class References : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Follows_FollowerId",
                table: "Follows",
                column: "FollowerId");

            migrationBuilder.CreateIndex(
                name: "IX_Follows_UserId",
                table: "Follows",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CommentLikes_ActivityId",
                table: "CommentLikes",
                column: "ActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_CommentLikes_UserId",
                table: "CommentLikes",
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
                name: "IX_ActivityLikes_ActivityId",
                table: "ActivityLikes",
                column: "ActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLikes_UserId",
                table: "ActivityLikes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityComments_ActivityId",
                table: "ActivityComments",
                column: "ActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityComments_UserId",
                table: "ActivityComments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_UserHostId",
                table: "Activities",
                column: "UserHostId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_Users_UserHostId",
                table: "Activities",
                column: "UserHostId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityComments_Activities_ActivityId",
                table: "ActivityComments",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityComments_Users_UserId",
                table: "ActivityComments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityLikes_Activities_ActivityId",
                table: "ActivityLikes",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityLikes_Users_UserId",
                table: "ActivityLikes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityRaiting_Activities_ActivityId",
                table: "ActivityRaiting",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityRaiting_Users_UserId",
                table: "ActivityRaiting",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CommentLikes_Activities_ActivityId",
                table: "CommentLikes",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CommentLikes_Users_UserId",
                table: "CommentLikes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_Users_FollowerId",
                table: "Follows",
                column: "FollowerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_Users_UserId",
                table: "Follows",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_Users_UserHostId",
                table: "Activities");

            migrationBuilder.DropForeignKey(
                name: "FK_ActivityComments_Activities_ActivityId",
                table: "ActivityComments");

            migrationBuilder.DropForeignKey(
                name: "FK_ActivityComments_Users_UserId",
                table: "ActivityComments");

            migrationBuilder.DropForeignKey(
                name: "FK_ActivityLikes_Activities_ActivityId",
                table: "ActivityLikes");

            migrationBuilder.DropForeignKey(
                name: "FK_ActivityLikes_Users_UserId",
                table: "ActivityLikes");

            migrationBuilder.DropForeignKey(
                name: "FK_ActivityRaiting_Activities_ActivityId",
                table: "ActivityRaiting");

            migrationBuilder.DropForeignKey(
                name: "FK_ActivityRaiting_Users_UserId",
                table: "ActivityRaiting");

            migrationBuilder.DropForeignKey(
                name: "FK_CommentLikes_Activities_ActivityId",
                table: "CommentLikes");

            migrationBuilder.DropForeignKey(
                name: "FK_CommentLikes_Users_UserId",
                table: "CommentLikes");

            migrationBuilder.DropForeignKey(
                name: "FK_Follows_Users_FollowerId",
                table: "Follows");

            migrationBuilder.DropForeignKey(
                name: "FK_Follows_Users_UserId",
                table: "Follows");

            migrationBuilder.DropIndex(
                name: "IX_Follows_FollowerId",
                table: "Follows");

            migrationBuilder.DropIndex(
                name: "IX_Follows_UserId",
                table: "Follows");

            migrationBuilder.DropIndex(
                name: "IX_CommentLikes_ActivityId",
                table: "CommentLikes");

            migrationBuilder.DropIndex(
                name: "IX_CommentLikes_UserId",
                table: "CommentLikes");

            migrationBuilder.DropIndex(
                name: "IX_ActivityRaiting_ActivityId",
                table: "ActivityRaiting");

            migrationBuilder.DropIndex(
                name: "IX_ActivityRaiting_UserId",
                table: "ActivityRaiting");

            migrationBuilder.DropIndex(
                name: "IX_ActivityLikes_ActivityId",
                table: "ActivityLikes");

            migrationBuilder.DropIndex(
                name: "IX_ActivityLikes_UserId",
                table: "ActivityLikes");

            migrationBuilder.DropIndex(
                name: "IX_ActivityComments_ActivityId",
                table: "ActivityComments");

            migrationBuilder.DropIndex(
                name: "IX_ActivityComments_UserId",
                table: "ActivityComments");

            migrationBuilder.DropIndex(
                name: "IX_Activities_UserHostId",
                table: "Activities");
        }
    }
}
