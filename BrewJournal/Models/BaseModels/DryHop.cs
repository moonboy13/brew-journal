using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
	public class DryHop : Hop
	{
		public TimeSpan AddTime { get; set; }
		public double Weight { get; set; }
		public string UOM { get; set; }
	}
}
