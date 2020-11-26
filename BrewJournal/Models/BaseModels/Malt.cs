using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
	public class Malt : ModelBase
	{
		public string Brand { get; set; }
		public string Type { get; set; }
		public bool Extract { get; set; }
		public bool Dry { get; set; }
		public bool Active { get; set; }
	}
}
