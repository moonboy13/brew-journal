using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
	public class Recipe
	{
		public string Name { get; set; }
		public string Style { get; set; }
		public string Notes { get; set; }
		public DateTime Created { get; set; }
		public DateTime Updated { get; set; }
		public DateTime LastBrewed { get; set; }
		public bool Active { get; set; }
		public List<BoilHop> BoilHops { get; set; }
		public List<DryHop> DryHops { get; set; }
		public List<RecipeMalt> Malts { get; set; }
		public User Creator { get; set; }
		public User Owner { get; set; }
	}
}
