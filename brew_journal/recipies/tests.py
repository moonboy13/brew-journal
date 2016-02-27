from datetime import datetime

from django.test import TestCase

from authentication.models import Account

from recipies.models import Recipe


# Create your tests here.
class TestRecipeModel(TestCase):
  """Test the custom method attached to the Recipe model"""

  def setUp(self):
    self.recipe_data = dict(
      name="Test Recipe",
      style="Kolsch",
      notes="This is my first test recipe submited from a unit test.",
      last_brewed=datetime.now()
    )
    self.malts_data = [
      dict(
        brand="MyBrand",
        type="Extra Light",
        amount="3.3",
      ),
      dict(
        brand="YourBrand",
        type="Crystal",
        amount="1.5",
        is_extract=False
      ),
      dict(
        brand="MyBrand",
        type="Light",
        amount="3",
        is_dry=False,
      ),
    ]
    self.hops_data = [
      dict(
        name="Cascade",
        alpha_acid_content="8.8",
        add_time="60",
        add_time_unit="Minutes",
      ),
      dict(
        name="Amarillo",
        alpha_acid_content="12.3",
        beta_acid_content="7.9",
        add_time="15",
        add_time_unit="Minutes",
      ),
      dict(
        name="Cascade",
        alpha_acid_content="7.9",
        beta_acid_content="4.6",
        add_time="7",
        add_time_unit="Days",
        dry_hop=True,
      ),
    ]
    self.user = Account.objects.create_user('test', 'foo')

  def tearDown(self):
    self.recipe_data=None
    self.malts_data=None
    self.hops_data=None
    self.user.delete()

  def test_RecipeManager_CreateValidRecipe(self):
    recipe = Recipe.objects.create_recipe(self.user, self.recipe_data, malts_data=self.malts_data, hops_data=self.hops_data)

    self.assertIsInstance(recipe, Recipe)