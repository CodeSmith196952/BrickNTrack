using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BrickNTrack.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddAmenityTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AmenityMasters",
                columns: table => new
                {
                    AmenityId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AmenityMasters", x => x.AmenityId);
                });

            migrationBuilder.CreateTable(
                name: "ProjectAmenities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    AmenityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectAmenities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectAmenities_AmenityMasters_AmenityId",
                        column: x => x.AmenityId,
                        principalTable: "AmenityMasters",
                        principalColumn: "AmenityId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectAmenities_ProjectMasters_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "ProjectMasters",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AmenityMasters_Name",
                table: "AmenityMasters",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAmenities_AmenityId",
                table: "ProjectAmenities",
                column: "AmenityId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAmenities_ProjectId_AmenityId",
                table: "ProjectAmenities",
                columns: new[] { "ProjectId", "AmenityId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectAmenities");

            migrationBuilder.DropTable(
                name: "AmenityMasters");
        }
    }
}
