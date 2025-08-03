using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BrickNTrack.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddedBuilderTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BuilderId",
                table: "UserManager",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "BuilderMasters",
                columns: table => new
                {
                    BuilderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TagLine = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OfficeAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LangLog = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmailAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Contact1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Contact2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GSTNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OwnerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "date", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "date", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuilderMasters", x => x.BuilderId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserManager_BuilderId",
                table: "UserManager",
                column: "BuilderId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserManager_BuilderMasters_BuilderId",
                table: "UserManager",
                column: "BuilderId",
                principalTable: "BuilderMasters",
                principalColumn: "BuilderId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserManager_BuilderMasters_BuilderId",
                table: "UserManager");

            migrationBuilder.DropTable(
                name: "BuilderMasters");

            migrationBuilder.DropIndex(
                name: "IX_UserManager_BuilderId",
                table: "UserManager");

            migrationBuilder.DropColumn(
                name: "BuilderId",
                table: "UserManager");
        }
    }
}
