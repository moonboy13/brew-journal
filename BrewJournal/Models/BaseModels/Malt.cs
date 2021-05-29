using System.ComponentModel.DataAnnotations;

namespace Models
{
	public class Malt
	{
		[Key]
		public int Id { get; set; }
		[Required]
		public string Brand { get; set; }
		[Required]
		public string Type { get; set; }
		public bool Extract { get; set; }
		public bool Dry { get; set; }
		public bool Active { get; set; } = true;
	}
}
