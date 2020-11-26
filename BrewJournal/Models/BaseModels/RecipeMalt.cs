using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
	public class RecipeMalt : ModelBase
	{
		public double Amount { get; set; }
		public string UOM { get; set; }

		public Malt Malt { get; set; }
	}
}
