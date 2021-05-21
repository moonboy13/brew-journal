using System;
using System.Collections.Generic;

namespace Models
{
	public class HistoricalRecipe
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Style { get; set; }
		public string Notes { get; set; }
		public DateTime LastBrewed { get; set; }
		public List<BoilHop> BoilHops { get; set; }
		public List<DryHop> DryHops { get; set; }
		public List<RecipeMalt> Malts { get; set; }
		public Recipe CurrentRecipe { get; set; }
		public DateTime SavedDate { get; set; }
	}
}
