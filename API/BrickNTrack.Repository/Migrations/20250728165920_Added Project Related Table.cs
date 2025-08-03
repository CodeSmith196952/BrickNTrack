using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BrickNTrack.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddedProjectRelatedTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProjectMasters",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ProjectDescription = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    CompletionPercentage = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ActualStartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ActualCompletionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ProjectAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Latlong = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfileImage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReraNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Budget = table.Column<double>(type: "float", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuilderId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "date", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "date", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMasters", x => x.ProjectId);
                    table.ForeignKey(
                        name: "FK_ProjectMasters_BuilderMasters_BuilderId",
                        column: x => x.BuilderId,
                        principalTable: "BuilderMasters",
                        principalColumn: "BuilderId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjectDataPaths",
                columns: table => new
                {
                    ProjectDataPathId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DataName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Path = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    FileType = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: true),
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "date", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "date", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectDataPaths", x => x.ProjectDataPathId);
                    table.ForeignKey(
                        name: "FK_ProjectDataPaths_ProjectMasters_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "ProjectMasters",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjectMilestones",
                columns: table => new
                {
                    MilestoneId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    MilestoneName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MilestoneDetails = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Budget = table.Column<double>(type: "float", nullable: false),
                    BudgetStatus = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: true),
                    PlannedStartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PlannedTargetDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PlannedDuration = table.Column<int>(type: "int", nullable: false),
                    ActualStartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ActualTargetDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ActualDuration = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "date", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "date", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMilestones", x => x.MilestoneId);
                    table.ForeignKey(
                        name: "FK_ProjectMilestones_ProjectMasters_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "ProjectMasters",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjectExpenses",
                columns: table => new
                {
                    ExpenseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Details = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Amount = table.Column<double>(type: "float", nullable: false),
                    VendorSupplier = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ProjectMilestoneId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "date", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "date", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectExpenses", x => x.ExpenseId);
                    table.ForeignKey(
                        name: "FK_ProjectExpenses_ProjectMilestones_ProjectMilestoneId",
                        column: x => x.ProjectMilestoneId,
                        principalTable: "ProjectMilestones",
                        principalColumn: "MilestoneId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectDataPaths_ProjectId",
                table: "ProjectDataPaths",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectExpenses_ProjectMilestoneId",
                table: "ProjectExpenses",
                column: "ProjectMilestoneId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMasters_BuilderId",
                table: "ProjectMasters",
                column: "BuilderId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMilestones_ProjectId",
                table: "ProjectMilestones",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectDataPaths");

            migrationBuilder.DropTable(
                name: "ProjectExpenses");

            migrationBuilder.DropTable(
                name: "ProjectMilestones");

            migrationBuilder.DropTable(
                name: "ProjectMasters");
        }
    }
}
