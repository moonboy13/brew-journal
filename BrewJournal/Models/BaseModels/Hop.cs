using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
	public class Hop : ModelBase
	{
		public string Name { get; set; }
		public double AlphaAcidContent { get; set; }
		public double BetaAcidContent { get; set; }
		public bool Active { get; set; } = true;
	}
}
