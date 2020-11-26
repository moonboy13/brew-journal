using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models;

namespace DatabaseConnector.Models
{
	public class RecipeDBM : Recipe
	{
		[ForeignKey("Creator")]
		public int CreatorId { get; set; }
		[ForeignKey("Owner")]
		public int OwnerId { get; set; }
	}
}
