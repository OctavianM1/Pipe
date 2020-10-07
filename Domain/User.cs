using System;

namespace Domain
{
    public class User
    {
        public Guid Id { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public int CountFollowers { get; set; }
        public int CountFollowing { get; set; }
    }
}

// migrationBuilder.CreateTable(
//         name: "Activities",
//         columns: table => new
//         {
//           Id = table.Column<Guid>(nullable: false),
//           UserHostId = table.Column<Guid>(nullable: false),
//           Title = table.Column<string>(nullable: true),
//           Body = table.Column<string>(nullable: true),
//           Subject = table.Column<string>(nullable: true),
//           DateTimeCreated = table.Column<DateTime>(nullable: true),
//         },
//         constraints: table =>
//         {
//           table.PrimaryKey("PK_Activities", x => x.Id);
//         });