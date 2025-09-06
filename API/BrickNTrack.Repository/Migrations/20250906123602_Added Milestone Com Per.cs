using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BrickNTrack.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddedMilestoneComPer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "ActualDuration",
                table: "ProjectMilestones",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MilestoneCompletionPer",
                table: "ProjectMilestones",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MilestoneCompletionPer",
                table: "ProjectMilestones");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ActualDuration",
                table: "ProjectMilestones",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
