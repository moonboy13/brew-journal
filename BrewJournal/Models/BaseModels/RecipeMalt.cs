﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Models
{
	public class RecipeMalt
	{
		[Key]
		public int Id { get; set; }
		public double Amount { get; set; }
		public string UOM { get; set; }
		public Malt Malt { get; set; }
		public int MaltId { get; set; }
		public Recipe Recipe { get; set; }
	}
}
