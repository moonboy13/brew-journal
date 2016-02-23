import json

from django.test import TestCase, Client

from authentication.models import Account

from authentication.views import LoginView

# Test Authentication models
class TestAccountModel(TestCase):
  """Testing of the Account model"""

  @staticmethod
  def get_user():
    """Either retrieve the fake user or create it"""
    user_obj, created = Account.objects.get_or_create(username='foot',password='bar2',defaults={'email':'fake@test.com','first_name':'john','last_name':'doe'})
    return user_obj

  def test_user_model(self):
    user = self.get_user()
    self.assertIsInstance(user, Account)
    self.assertTrue(user.__unicode__(), user.username)
    self.assertTrue(user.get_short_name(), user.first_name)
    self.assertTrue(user.get_full_name(), user.first_name + ' ' + user.last_name)
    self.assertTrue(user.email, 'fake@test.com')
    self.assertTrue(user.password, 'bar')

  def test_create_user_failure(self):
    with self.assertRaises(ValueError) as err:
      Account.objects.create_user(None,password='bar')

    exception = err.exception
    self.assertTrue(exception.message, 'Users must have a valid username.')

  def test_create_user(self):
    user = Account.objects.create_user('test',password='bar')
    self.assertIsInstance(user, Account)
    self.assertTrue(user.username, 'test')
    self.assertTrue(user.password, 'bar')
    self.assertFalse(user.is_admin)

  def test_create_superuser(self):
    super_user = Account.objects.create_superuser('admin',password='secure')
    self.assertIsInstance(super_user, Account)
    self.assertTrue(super_user.username, 'test')
    self.assertTrue(super_user.password, 'bar')
    self.assertTrue(super_user.is_admin)


class TestLoginView(TestCase):
  """Testing the login view"""
  #Using this method to set the username and password b/c Django will return the password in a hashed
  #state making it impossible to re-authenticate w/ the user object.
  username = 'faux'
  password = 'bar'

  def make_user(self):
      return Account.objects.create_user(username=self.username, password=self.password)

  def login(self, username=username, password=password):
    request_url  = '/api/v1/auth/login/'
    request_body = json.dumps({'username':username,'password':password})
    return self.client.post(request_url, data=request_body, content_type='application/json')

  def setUp(self):
    self.client = Client()
    self.user = self.make_user();

  def tearDown(self):
    self.client = None
    self.user.delete()

  def test_LoginView_validUserLogin(self):
    response = self.login()
    returned_user = response.data

    self.assertTrue(returned_user['username'], self.username)
