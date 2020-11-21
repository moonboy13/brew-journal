using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
	public class HistoricalRecipe
	{
		public Recipe CurrentRecipe { get; set; }
		public DateTime SavedDate { get; set; }
	}
}
