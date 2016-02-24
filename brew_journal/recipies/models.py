from django.db import models

# Recipe model to gather all of the ingredients details together
class Recipe(model.Models):
  """Contain all of a user's recipies"""
  recipe_name = models.CharField(max_length=60)

  date_created   = models.DateTimeField(auto_now_add=True)
  date_updated   = models.DateTimeField(auto_now=True)
  last_brew_date = models.DateTimeField(blank=True)

class RecipeMalts(model.Models):
  """Hold descriptors for all the malts used in a recipe"""
  malt_name = models.CharField(max_length=120)

  amount_by_weight = models.DecimalField(max_digits=10, decimal_places=3)

class RecipeHops(model.Models):
  """Table for each of the hops in a recipe"""

class RecipeGravityChecks(model.Models):
  """Holder for each gravity check and the percent alcohol at that date"""

