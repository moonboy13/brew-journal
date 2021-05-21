using Microsoft.EntityFrameworkCore;
using Models;
using System.Threading.Tasks;

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

		public BaseDBContext(DbContextOptions<BaseDBContext> options) : base(options) { }

		public BaseDBContext() : base()
		{ }

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
			#region User
			modelBuilder
				.Entity<User>()
				.HasIndex(User => User.Username)
				.IsUnique();
			#endregion
		}
	}
}
