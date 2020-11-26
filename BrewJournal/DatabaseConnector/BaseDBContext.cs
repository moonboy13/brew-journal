using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DatabaseConnector.Models;

namespace DatabaseConnector
{
	/// <summary>
	/// Base class for all database connectors. Empty initially but pre-defining for
	/// simplicity
	/// </summary>
	public class BaseDBContext : DbContext
	{
		public virtual DbSet<HopDBM> Hop { get; set; }
		public virtual DbSet<MaltDBM> Malt { get; set; }
		public virtual DbSet<RecipeDBM> Recipe { get; set; }
		public virtual DbSet<RecipeMaltDBM> RecipeMalt { get; set; }
		public virtual DbSet<UserDBM> User { get; set; }
	}
}
