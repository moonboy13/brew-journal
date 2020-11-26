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
	public class RecipeMaltDBM : RecipeMalt
	{
		public int RecipeId { get; set; }
		[ForeignKey("RecipeId")]
		public RecipeDBM Recipe { get; set; }

		[ForeignKey("Malt")]
		public int MaltId { get; set; }
	}
}
