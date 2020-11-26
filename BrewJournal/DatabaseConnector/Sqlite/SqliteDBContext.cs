using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DatabaseConnector.Models;

namespace DatabaseConnector.Sqlite
{
	public class SqliteDBContext : BaseDBContext
	{
		private static SqliteDBContext Instance;

		public static SqliteDBContext GetContext()
		{
			if(Instance is null)
			{
				Instance = new ();
			}

			return Instance;
		}

		public SqliteDBContext()
			: base()
		{ }

		//-- TODO: Parameterize this appropriately
		protected override void OnConfiguring(DbContextOptionsBuilder dbContextOptionsBuilder) =>
			dbContextOptionsBuilder.UseSqlite(@"Data Source=E:\TestingDB\BrewJournal");

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			//-- Configure the primary key property. Left it as a generic Object type to support
			//-- multiple column types, so have to explicitly say I mean integer here.
			modelBuilder.Entity<HopDBM>().HasKey(Hop => Hop.Id);
			modelBuilder.Entity<HopDBM>().Property(Hop => Hop.Id).HasColumnType("INTEGER");
			modelBuilder.Entity<MaltDBM>().HasKey(Malt => Malt.Id);
			modelBuilder.Entity<MaltDBM>().Property(Malt => Malt.Id).HasColumnType("INTEGER");
			modelBuilder.Entity<RecipeDBM>().HasKey(Recipe => Recipe.Id);
			modelBuilder.Entity<RecipeDBM>().Property(Recipe => Recipe.Id).HasColumnType("INTEGER");
			modelBuilder.Entity<RecipeMaltDBM>().HasKey(RecipeMalt => RecipeMalt.Id);
			modelBuilder.Entity<RecipeMaltDBM>().Property(RecipeMalt => RecipeMalt.Id).HasColumnType("INTEGER");
			modelBuilder.Entity<UserDBM>().HasKey(User => User.Id);
			modelBuilder.Entity<UserDBM>().Property(User => User.Id).HasColumnType("INTEGER");
		}
	}
}
