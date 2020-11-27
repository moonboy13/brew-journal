using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
	public class DryHop
	{
		public int Id { get; set; }
		public TimeSpan AddTime { get; set; }
		public double Weight { get; set; }
		public string UOM { get; set; }
		public Hop Hop { get; set; }
		public Recipe Recipe { get; set; }
	}
}
