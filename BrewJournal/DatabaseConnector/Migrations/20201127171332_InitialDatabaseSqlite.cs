using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace DatabaseConnector.Migrations
{
	public partial class InitialDatabaseSqlite : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.CreateTable(
				name: "Hop",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					Name = table.Column<string>(type: "TEXT", nullable: true),
					AlphaAcidContent = table.Column<double>(type: "REAL", nullable: false),
					BetaAcidContent = table.Column<double>(type: "REAL", nullable: false),
					Active = table.Column<bool>(type: "INTEGER", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Hop", x => x.Id);
				});

			migrationBuilder.CreateTable(
				name: "Malt",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					Brand = table.Column<string>(type: "TEXT", nullable: true),
					Type = table.Column<string>(type: "TEXT", nullable: true),
					Extract = table.Column<bool>(type: "INTEGER", nullable: false),
					Dry = table.Column<bool>(type: "INTEGER", nullable: false),
					Active = table.Column<bool>(type: "INTEGER", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Malt", x => x.Id);
				});

			migrationBuilder.CreateTable(
				name: "User",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					Username = table.Column<string>(type: "TEXT", nullable: true),
					Email = table.Column<string>(type: "TEXT", nullable: true),
					FirstName = table.Column<string>(type: "TEXT", nullable: true),
					LastName = table.Column<string>(type: "TEXT", nullable: true),
					Admin = table.Column<bool>(type: "INTEGER", nullable: false),
					Active = table.Column<bool>(type: "INTEGER", nullable: false),
					Created = table.Column<DateTime>(type: "TEXT", nullable: false),
					Update = table.Column<DateTime>(type: "TEXT", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_User", x => x.Id);
				});

			migrationBuilder.CreateTable(
				name: "Recipe",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					Name = table.Column<string>(type: "TEXT", nullable: true),
					Style = table.Column<string>(type: "TEXT", nullable: true),
					Notes = table.Column<string>(type: "TEXT", nullable: true),
					Created = table.Column<DateTime>(type: "TEXT", nullable: false),
					Updated = table.Column<DateTime>(type: "TEXT", nullable: false),
					LastBrewed = table.Column<DateTime>(type: "TEXT", nullable: false),
					Active = table.Column<bool>(type: "INTEGER", nullable: false),
					CreatorId = table.Column<int>(type: "INTEGER", nullable: false),
					OwnerId = table.Column<int>(type: "INTEGER", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Recipe", x => x.Id);
					table.ForeignKey(
						name: "FK_Recipe_User_CreatorId",
						column: x => x.CreatorId,
						principalTable: "User",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
					table.ForeignKey(
						name: "FK_Recipe_User_OwnerId",
						column: x => x.OwnerId,
						principalTable: "User",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateTable(
				name: "BoilHop",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					BoilTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
					Weight = table.Column<double>(type: "REAL", nullable: false),
					UOM = table.Column<string>(type: "TEXT", nullable: true),
					HopId = table.Column<int>(type: "INTEGER", nullable: true),
					RecipeId = table.Column<int>(type: "INTEGER", nullable: true)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_BoilHop", x => x.Id);
					table.ForeignKey(
						name: "FK_BoilHop_Hop_HopId",
						column: x => x.HopId,
						principalTable: "Hop",
						principalColumn: "Id",
						onDelete: ReferentialAction.Restrict);
					table.ForeignKey(
						name: "FK_BoilHop_Recipe_RecipeId",
						column: x => x.RecipeId,
						principalTable: "Recipe",
						principalColumn: "Id",
						onDelete: ReferentialAction.Restrict);
				});

			migrationBuilder.CreateTable(
				name: "DryHop",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					AddTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
					Weight = table.Column<double>(type: "REAL", nullable: false),
					UOM = table.Column<string>(type: "TEXT", nullable: true),
					HopId = table.Column<int>(type: "INTEGER", nullable: true),
					RecipeId = table.Column<int>(type: "INTEGER", nullable: true)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_DryHop", x => x.Id);
					table.ForeignKey(
						name: "FK_DryHop_Hop_HopId",
						column: x => x.HopId,
						principalTable: "Hop",
						principalColumn: "Id",
						onDelete: ReferentialAction.Restrict);
					table.ForeignKey(
						name: "FK_DryHop_Recipe_RecipeId",
						column: x => x.RecipeId,
						principalTable: "Recipe",
						principalColumn: "Id",
						onDelete: ReferentialAction.Restrict);
				});

			migrationBuilder.CreateTable(
				name: "RecipeMalt",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					Amount = table.Column<double>(type: "REAL", nullable: false),
					UOM = table.Column<string>(type: "TEXT", nullable: true),
					MaltId = table.Column<int>(type: "INTEGER", nullable: false),
					RecipeId = table.Column<int>(type: "INTEGER", nullable: true)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_RecipeMalt", x => x.Id);
					table.ForeignKey(
						name: "FK_RecipeMalt_Malt_MaltId",
						column: x => x.MaltId,
						principalTable: "Malt",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
					table.ForeignKey(
						name: "FK_RecipeMalt_Recipe_RecipeId",
						column: x => x.RecipeId,
						principalTable: "Recipe",
						principalColumn: "Id",
						onDelete: ReferentialAction.Restrict);
				});

			migrationBuilder.CreateIndex(
				name: "IX_BoilHop_HopId",
				table: "BoilHop",
				column: "HopId");

			migrationBuilder.CreateIndex(
				name: "IX_BoilHop_RecipeId",
				table: "BoilHop",
				column: "RecipeId");

			migrationBuilder.CreateIndex(
				name: "IX_DryHop_HopId",
				table: "DryHop",
				column: "HopId");

			migrationBuilder.CreateIndex(
				name: "IX_DryHop_RecipeId",
				table: "DryHop",
				column: "RecipeId");

			migrationBuilder.CreateIndex(
				name: "IX_Recipe_CreatorId",
				table: "Recipe",
				column: "CreatorId");

			migrationBuilder.CreateIndex(
				name: "IX_Recipe_OwnerId",
				table: "Recipe",
				column: "OwnerId");

			migrationBuilder.CreateIndex(
				name: "IX_RecipeMalt_MaltId",
				table: "RecipeMalt",
				column: "MaltId");

			migrationBuilder.CreateIndex(
				name: "IX_RecipeMalt_RecipeId",
				table: "RecipeMalt",
				column: "RecipeId");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
				name: "BoilHop");

			migrationBuilder.DropTable(
				name: "DryHop");

			migrationBuilder.DropTable(
				name: "RecipeMalt");

			migrationBuilder.DropTable(
				name: "Hop");

			migrationBuilder.DropTable(
				name: "Malt");

			migrationBuilder.DropTable(
				name: "Recipe");

			migrationBuilder.DropTable(
				name: "User");
		}
	}
}
