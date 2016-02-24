from django.conf import settings
from django.db import models

# Recipe model to gather all of the ingredients details together
class Recipe(models.Model):
  """Contain all of a user's recipies"""
  recipe_name  = models.CharField(max_length=60)
  recipe_style = models.CharField(max_length=140)
  recipe_notes = models.TextField()

  date_created   = models.DateTimeField(auto_now_add=True)
  date_updated   = models.DateTimeField(auto_now=True)
  last_brew_date = models.DateTimeField(null=True, blank=True)

  account = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="account", null=True)

  status   = models.BooleanField(default=True)

class RecipeMalts(models.Model):
  """Hold descriptors for all the malts used in a recipe"""
  malt_brand = models.CharField(max_length=120)
  malt_type  = models.CharField(max_length=120)

  malt_extract = models.BooleanField(default=True)
  dry_malt     = models.BooleanField(default=False)

  recipe = models.ForeignKey('Recipe', related_name='recipe_malts', null=True)

  amount_by_weight = models.FloatField()

  status   = models.BooleanField(default=True)

class RecipeHops(models.Model):
  """Table for each of the hops in a recipe"""
  hop_name = models.CharField(max_length=80)

  recipe = models.ForeignKey('Recipe', related_name='recipe_hops', null=True)

  alpha_acid_content = models.FloatField()
  beta_acid_content  = models.FloatField(blank=True)
  add_time           = models.FloatField()
  # Either Days, Weeks, Minutes
  add_time_unit      = models.CharField(max_length=7)

  dry_hops = models.BooleanField(default=False)
  status   = models.BooleanField(default=True)