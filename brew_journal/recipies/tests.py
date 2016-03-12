from datetime import datetime

from django.test import TestCase

from authentication.models import Account

from recipies.models import Recipe


# Create your tests here.
class TestRecipeModel(TestCase):
  """Test the custom method attached to the Recipe model"""

  def setUp(self):
    self.recipe_data = dict(
      recipe_name="Test Recipe",
      recipe_style="Kolsch",
      recipe_notes="This is my first test recipe submited from a unit test.",
      last_brew_date=datetime.now()
    )
    self.malts_data = [
      dict(
        malt_brand="ABrand",
        malt_type="Extra Light",
        amount_by_weight=3.3,
      ),
      dict(
        malt_brand="BBrand",
        malt_type="Crystal",
        amount_by_weight=1.5,
        malt_extract=False
      ),
      dict(
        malt_brand="CBrand",
        malt_type="Light",
        amount_by_weight=3,
        dry_malt=False,
      ),
    ]
    self.hops_data = [
      dict(
        hop_name="Amarillo",
        alpha_acid_content=12.3,
        beta_acid_content=7.9,
        add_time=15,
        add_time_unit="Minutes",
      ),
      dict(
        hop_name="Cascade",
        alpha_acid_content=8.8,
        add_time=60,
        add_time_unit="Minutes",
      ),
      dict(
        hop_name="Citra",
        alpha_acid_content=7.9,
        beta_acid_content=4.6,
        add_time=7,
        add_time_unit="Days",
        dry_hops=True,
      ),
    ]
    self.user = Account.objects.create_user('test', 'foo')

  def tearDown(self):
    self.recipe_data=None
    self.malts_data=None
    self.hops_data=None
    self.user.delete()

  def checkElement(self, model, data):
    """Helper Function. Either check two values against on another or call correct helper function"""
    # IF the type is a list or dict, call the correct function to check its elements. ELSE directly
    # compare the elements
    if type(model) is list:
      self.checkArrayModel(model, data)
    elif type(model) is dict:
      self.checkDictModel(model, data)
    else:
      self.assertEqual(model, data)

  def checkArrayModel(self, model, data):
    """Helper function. Check an array to see if the model data is present in the data array"""

    for i in range(len(model)):
      self.checkElement(model[i], data[i])

  def checkDictModel(self, model, data):
    """Helper function. Check a model dictionary against a data dictionary key by key"""
    for key in model.keys():
      self.checkElement(model.get(key), data.__dict__.get(key))


  def test_RecipeManager_CreateValidRecipe(self):
    recipe = Recipe.objects.create_recipe(self.user, self.recipe_data, malts_data=self.malts_data, hops_data=self.hops_data)

    self.assertIsInstance(recipe, Recipe)

    self.checkElement(self.hops_data, recipe.recipe_hops.order_by("hop_name"))
    self.checkElement(self.malts_data, recipe.recipe_malts.order_by("malt_brand"))
    self.checkElement(self.recipe_data, recipe)
