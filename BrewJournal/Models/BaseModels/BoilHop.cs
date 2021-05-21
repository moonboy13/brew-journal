using System;
using System.ComponentModel.DataAnnotations;

namespace Models
{
	public class BoilHop
	{
		[Key]
		public int Id { get; set; }
		public TimeSpan BoilTime { get; set; }
		public double Weight { get; set; }
		public string UOM { get; set; }

		public Hop Hop { get; set; }
		public Recipe Recipe { get; set; }
	}
}
