from django.conf import settings
from django.db import models

class RecipeManager(models.Manager):
  """Adding some custom functionality so that saving a recipe and all the related fields can be done at one time"""
  def create_recipe(self, user, recipe_data, malts_data=None, hops_data=None, **kwargs):
    if not user:
      raise ValueError('Need to be logged in to create a recipe.')
    if not user.is_active:
      raise ValueError('Account must be active to create a recipe.')
    if recipe_data is None:
      raise ValueError('Recipe information is required to create a recipe.')

    # Base format:
    # recipe = recipe.create()
    # malts = recipe.recipe_malts.create()
    recipe = user.recipe.create(
      recipe_name=recipe_data['name'],
      recipe_style=recipe_data['style'],
      recipe_notes=recipe_data['notes'],
      last_brew_date=recipe_data['last_brewed']
    )

    # Adding of the hops
    if hops_data is not None:
      for hop in hops_data:
        new_hop = recipe.recipe_hops.create(
          hop_name=hop['name'],
          alpha_acid_content=hop['alpha_acid_content'],
          add_time=hop['add_time'],
          add_time_unit=hop['add_time_unit'],
        )
        if 'beta_acid_content' in hop:
          new_hop.beta_acid_content = hop['beta_acid_content']

        if 'dry_hop' in hop and hop['dry_hop']:
          new_hop.dry_hop = hop['dry_hop']

    if malts_data is not None:
      for malt in malts_data:
        new_malt = recipe.recipe_malts.create(
          malt_brand=malt['brand'],
          malt_type=malt['type'],
          amount_by_weight=malt['amount'],
        )
        if 'malt_extract' in malt:
          new_malt.malt_extract = malt['is_extract']

        if 'dry_malt' in malt and malt['is_dry']:
          malt.dry_malt=malt['is_dry']

    recipe.save()
    return recipe

# Recipe model to gather all of the ingredients details together
class Recipe(models.Model):
  """Contain all of a user's recipies"""
  recipe_name  = models.CharField(max_length=60)
  recipe_style = models.CharField(max_length=140)
  recipe_notes = models.TextField()

  date_created   = models.DateField(auto_now_add=True)
  date_updated   = models.DateField(auto_now=True)
  last_brew_date = models.DateField(null=True, blank=True)

  account = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="recipe", null=True)

  status   = models.BooleanField(default=True)

  objects = RecipeManager()

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
  beta_acid_content  = models.FloatField(null=True, blank=True)
  add_time           = models.FloatField()
  # Either Days, Weeks, Minutes
  add_time_unit      = models.CharField(max_length=7)

  dry_hops = models.BooleanField(default=False)
  status   = models.BooleanField(default=True)
