﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
	public class BoilHop : Hop
	{
		public TimeSpan BoilTime { get; set; }
		public double Weight { get; set; }
		public string UOM { get; set; }
	}
}