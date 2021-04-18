using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Models
{
	public class User
	{
		[Key]
		public int Id { get; set; }
		public string Username { get; set; }
		public string Email { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public bool Admin { get; set; }
		public bool Active { get; set; }
		public DateTime Created { get; set; }
		public DateTime Update { get; set; }
		[InverseProperty(nameof(Recipe.Owner))]
		public ICollection<Recipe> Recipes { get; set; }
		[InverseProperty(nameof(Recipe.Creator))]
		public ICollection<Recipe> CreatedRecipes { get; set; }
	}
}