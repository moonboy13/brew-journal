using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models;

namespace DatabaseConnector
{
	/// <summary>
	/// Base class for all database connectors. Empty initially but pre-defining for
	/// simplicity
	/// </summary>
	public class BaseDBContext : DbContext
	{
		public virtual DbSet<Hop> Hop { get; set; }
		public virtual DbSet<BoilHop> BoilHop { get; set; }
		public virtual DbSet<DryHop> DryHop { get; set; }
		public virtual DbSet<Malt> Malt { get; set; }
		public virtual DbSet<Recipe> Recipe { get; set; }
		// Leaving this table out of the DB till I can figure out how to do it right.
		//public virtual DbSet<HistoricalRecipe> HistoricalRecipe {get;set;}
		public virtual DbSet<RecipeMalt> RecipeMalt { get; set; }
		public virtual DbSet<User> User { get; set; }

		/// <summary>
		/// This wraps the entity framework function SaveChangesAsyc and allows for
		/// Moq to mock out the DB save function.
		/// </summary>
		/// <returns></returns>
		public virtual Task<int> SaveAsync()
		{
			return SaveChangesAsync();
		}

		public virtual Task<int> DeleteAsync<T>(T obj)
			where T : class
		{
			Entry(obj).State = EntityState.Deleted;
			return SaveAsync();
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			#region Hop
			modelBuilder.Entity<Hop>().HasKey(Hop => Hop.Id);
			#endregion
			#region Malt
			modelBuilder.Entity<Malt>().HasKey(Malt => Malt.Id);
			#endregion
			#region Recipe
			modelBuilder.Entity<Recipe>()
				.HasKey(Recipe => Recipe.Id);
			modelBuilder.Entity<Recipe>()
				.HasOne(Recipe => Recipe.Owner)
				.WithMany(User => User.Recipes)
				.HasForeignKey(Recipe => Recipe.OwnerId);
			modelBuilder.Entity<Recipe>()
				.HasOne(Recipe => Recipe.Creator)
				.WithMany(User => User.CreatedRecipes)
				.HasForeignKey(Recipe => Recipe.CreatorId);
			#endregion
			#region RecipeMalt
			modelBuilder.Entity<RecipeMalt>()
				.HasKey(RecipeMalt => RecipeMalt.Id);
			modelBuilder.Entity<RecipeMalt>()
				.HasOne(RecipeMalt => RecipeMalt.Malt)
				.WithMany()
				.HasForeignKey(RecipeMalt => RecipeMalt.MaltId);
			modelBuilder.Entity<RecipeMalt>()
				.HasOne(RecipeMalt => RecipeMalt.Recipe)
				.WithMany(Recipe => Recipe.Malts);
			#endregion
			#region User
			modelBuilder.Entity<User>().HasKey(User => User.Id);
			#endregion
			#region BoilHop
			modelBuilder.Entity<BoilHop>()
				.HasKey(BoilHop => BoilHop.Id);
			modelBuilder.Entity<BoilHop>()
				.HasOne(BoilHop => BoilHop.Hop)
				.WithMany();
			modelBuilder.Entity<BoilHop>()
				.HasOne(BoilHop => BoilHop.Recipe)
				.WithMany(Recipe => Recipe.BoilHops);
			#endregion
			#region DryHop
			modelBuilder.Entity<DryHop>()
				.HasKey(DryHop => DryHop.Id);
			modelBuilder.Entity<DryHop>()
				.HasOne(DryHop => DryHop.Hop)
				.WithMany();
			modelBuilder.Entity<DryHop>()
				.HasOne(DryHop => DryHop.Recipe)
				.WithMany(Recipe => Recipe.DryHops);
			#endregion
		}
	}
}
