using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Models
{
	public class Hop
	{
		[Key]
		public int Id { get; set; }
		
		[Required(ErrorMessageResourceName = nameof(Properties.Resources.RequiredErrorMsg), ErrorMessageResourceType = typeof(Properties.Resources))]
		public string Name { get; set; }
		
		[Range(0.0, 50.0, ErrorMessageResourceName = nameof(Properties.Resources.RangeErrorMsg), ErrorMessageResourceType = typeof(Properties.Resources)),
			Required(ErrorMessageResourceName = nameof(Properties.Resources.RequiredErrorMsg), ErrorMessageResourceType = typeof(Properties.Resources))]
		public double AlphaAcidContent { get; set; }
		
		[Range(0.0, 50.0, ErrorMessageResourceName = nameof(Properties.Resources.RangeErrorMsg), ErrorMessageResourceType = typeof(Properties.Resources))]
		public double BetaAcidContent { get; set; }
		
		public bool Active { get; set; } = true;
	}
}
