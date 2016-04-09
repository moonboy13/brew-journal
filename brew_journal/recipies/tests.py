import json

from datetime import datetime

from django.test import TestCase, Client

from authentication.models import Account

from recipies.models import Recipe
from recipies.serializers import RecipeSerializer


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
        dry_malt=True,
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

  def test_RecipeManager_FailNoRecipeData(self):
    with self.assertRaises(ValueError) as err:
      Recipe.objects.create_recipe(self.user, None, self.malts_data, self.hops_data)

    self.assertEqual(err.exception.message, 'Recipe information is required to create a recipe.')

  def test_RecipeManager_FailInactiveUser(self):
    self.user.is_active=False
    with self.assertRaises(ValueError) as err:
      Recipe.objects.create_recipe(self.user, self.recipe_data, malts_data=self.malts_data, hops_data=self.hops_data)

    self.assertEqual(err.exception.message, 'Account must be active to create a recipe.')

  def test_RecipeManager_FailNotLoggedIn(self):
    with self.assertRaises(ValueError) as err:
      Recipe.objects.create_recipe(None, self.recipe_data, malts_data=self.malts_data, hops_data=self.hops_data)

    self.assertEqual(err.exception.message, 'Need to be logged in to create a recipe.')

class TestRecipeSerializer(TestCase):
  """Test the serializers for the recipe class"""

  def setUp(self):
    self.json_data = open('recipies/testRecipe.json','r').read()
    self.data = self.retrieveRecipeData()
    # Extract just the date portion from the datetime object
    my_datetime = datetime.today()
    self.data['last_brew_date'] = datetime.date(my_datetime)

    self.account = Account.objects.create(username='foot',password='bar2')

  def tearDown(self):
    self.json_data = None
    self.data = None
    self.account.delete()

  def retrieveRecipeData(self):
    """Retrieve a new decoding of the JSON recipe data"""
    return json.loads(self.json_data)

  def createRecipe(self, user, data):
    """Create a recipe for use with the update unit test"""
    hops  = data.pop("recipe_hops")
    malts = data.pop("recipe_malts")
    return Recipe.objects.create_recipe(user, data, malts, hops)

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

  def test_RecipeSerializer_Create_ValidData(self):
    serialized_data = RecipeSerializer(data=self.data)

    self.assertTrue(serialized_data.is_valid())

    recipe = serialized_data.save(user=self.account)
    self.checkElement(self.data.pop('recipe_hops'), recipe.recipe_hops.order_by("hop_name"))
    self.checkElement(self.data.pop('recipe_malts'), recipe.recipe_malts.order_by("malt_brand"))
    self.checkElement(self.data, recipe)

  def test_RecipeSerializer_Update_ValidData(self):
    premade_recipe = self.createRecipe(self.account, self.data)
    recipe_data    = self.retrieveRecipeData()
    # Add another hop
    self.data['recipe_hops'] = list()
    self.data['recipe_hops'].append(dict(
      hop_name="Tettang",
      alpha_acid_content=8.8,
      beta_acid_content=6.4,
      add_time=3,
      add_time_unit="Days",
      dry_hops=True,
    ))

    # Change the malt
    self.data['recipe_malts'] = list()
    self.data['recipe_malts'].append(dict(
        malt_brand="Fruity_Tooty",
        malt_type="Crystal",
        malt_extract=False,
        amount_by_weight=7.0,
    ))

    # Update the notes
    self.data['recipe_notes'] = "Added this crystal to spice it up."

    serializer = RecipeSerializer(instance=premade_recipe, data=self.data)

    self.assertTrue(serializer.is_valid())

    updated_recipe = serializer.save()

    self.checkElement(self.data.pop('recipe_hops'), updated_recipe.recipe_hops.order_by("hop_name"))
    self.checkElement(self.data.pop('recipe_malts'), updated_recipe.recipe_malts.order_by("malt_brand"))
    self.checkElement(self.data, updated_recipe)

class TestRecipeViews(TestCase):
  """Check all of the http urls for the recipes"""

  def setUp(self):
    self.client = Client()
    self.user = Account.objects.create_user(username='foot',password='bar2',email='fake@test.com',first_name='john',last_name='doe')
    # Set the fake user to logged in as this is required for some of the requests.
    self.client.login(username='foot',password='bar2')
    my_datetime = datetime.today()
    self.data = self.loadRecipeData()
    for i in range(len(self.data)):
      self.data[i]['last_brew_date'] = datetime.date(my_datetime)
    self.setupRecipes(self.data, self.user)

  def tearDown(self):
    self.user.delete()
    self.removeRecipes()

    self.client = None
    self.user = None

  def loadRecipeData(self):
    json_data = open('recipies/testRecipes.json' ,'r').read()
    return json.loads(json_data)

  def setupRecipes(self, recipes, user):
    for i in range(len(recipes)):
      Recipe.objects.create_recipe(user, recipes[i], recipes[i].get("recipe_malts"), recipes[i].get("recipe_hops"))

  def removeRecipes(self):
    self.data = []
    for recipe in Recipe.objects.all():
      recipe.delete()

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
    # print model
    # print data
    for i in range(len(model)):
      self.checkElement(model[i], data[i])

  def checkDictModel(self, model, data):
    """Helper function. Check a model dictionary against a data dictionary key by key"""
    for key in model.keys():
      self.checkElement(model.get(key), data.__dict__.get(key))

  def test_RecipeViews_ListRecipes_HasRecipes(self):
    response = self.client.get('/api/v1/recipe/')

    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.data), len(self.data))

  def test_RecipeViews_ListRecipes_NoRecipes(self):
    self.removeRecipes()

    response = self.client.get('/api/v1/recipe/')

    self.assertEqual(response.status_code, 204)
    self.assertEqual(len(response.data), 0)

  def test_RecipeViews_ListRecipes_UnauthorizedUser(self):
    # First, delete the user
    self.user.is_active = False
    self.user.save()

    response = self.client.get('/api/v1/recipe/')

    self.assertEqual(response.status_code, 401)
    self.assertEqual(response.reason_phrase.lower(), 'unauthorized')
    self.assertEqual(response.data['status'].lower(), 'unauthorized')
    self.assertEqual(response.data['message'], 'Requesting user is no longer active.')

  def test_RecipeViews_DetailRecipe_InvalidId(self):

    response = self.client.get('/api/v1/recipe/999/')

    self.assertEqual(response.status_code, 404)
    self.assertEqual(response.reason_phrase.lower(), 'not found')
    self.assertEqual(response.data['detail'].lower(), 'not found.')

  def test_RecipeViews_DetailRecipe_ValidRecipe(self):
    # Use the first rescipe in the array
    recipe_data = self.data[0]

    db_entry = Recipe.objects.get(recipe_name=recipe_data['recipe_name'])

    response = self.client.get('/api/v1/recipe/' + str(db_entry.id) + '/')

    self.assertEqual(response.status_code, 200)

    # TODO: Leaving this off for now until I can figure out how to compare an orderdDict to regular dict.
    # self.checkElement(recipe_data, response.data)

  def test_RecipeViews_DestroyRecipe_InvalidId(self):

    response = self.client.delete('/api/v1/recipe/999/')

    self.assertEqual(response.status_code, 404)
    self.assertEqual(response.reason_phrase.lower(), 'not found')
    self.assertEqual(response.data['detail'].lower(), 'not found.')

  def test_RecipeViews_DestroyRecipe_ValidRecipe(self):
    # Use the first rescipe in the array
    before_recipe_length = len(Recipe.objects.all())
    recipe_data = self.data[0]
    db_entry = Recipe.objects.get(recipe_name=recipe_data['recipe_name'])

    response = self.client.delete('/api/v1/recipe/' + str(db_entry.id) + '/')

    after_recipe_length = len(Recipe.objects.all())

    self.assertEqual(response.status_code, 204)
    self.assertEqual(len(response.data), 0)
    self.assertEqual(after_recipe_length, (before_recipe_length - 1) )

  def test_RecipeViews_CreateRecipe_ValidData(self):
    json_new_recipe = open('recipies/testRecipe.json' ,'r').read()
    new_recipe = json.loads(json_new_recipe)

    response = self.client.post('/api/v1/recipe/', data=json_new_recipe, content_type='application/json')

    self.assertEqual(response.status_code, 201)
    self.assertEqual(response.reason_phrase.lower(), 'created')
    self.assertEqual(response.data['message'], 'Recipe has been created.')
    # TODO: Deal with the ordered dict that is returned
    # self.checkElement(new_recipe, response.data['recipe'])

  def test_RecipeViews_CreateRecipe_InvalidData(self):

    invalid_json = json.dumps({})

    response = self.client.post('/api/v1/recipe/', data=invalid_json, content_type='application/json')

    self.assertEqual(response.status_code, 400)
    self.assertEqual(response.reason_phrase.lower(), 'bad request')
    self.assertEqual(response.data['message'], 'Recipe could not be created with the received data.')
    # Just make sure that there are items in the error array so that the user knows what they need to fix
    self.assertTrue( ( len(response.data['errors']) > 0 ) )
