using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Models;

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
			dbContextOptionsBuilder.UseSqlite(@"Data Source=E:\TestingDB\BrewJournal\BrewJournal.db");
	}
}
