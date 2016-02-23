import json

from django.test import TestCase, Client

from authentication.models import Account

from authentication.views import LoginView

# Test Authentication models
class TestAccountModel(TestCase):
  """Testing of the Account model"""

  def setUp(self):
    self.user = Account.objects.create(username='foot',password='bar2',email='fake@test.com',first_name='john',last_name='doe')

  def tearDown(self):
    self.user.delete()

  def test_user_model(self):
    # user = self.get_user()
    self.assertIsInstance(self.user, Account)
    self.assertTrue(self.user.__unicode__(), self.user.username)
    self.assertTrue(self.user.get_short_name(), self.user.first_name)
    self.assertTrue(self.user.get_full_name(), self.user.first_name + ' ' + self.user.last_name)
    self.assertTrue(self.user.email, 'fake@test.com')
    self.assertTrue(self.user.password, 'bar')

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


class TestLoginLogoutView(TestCase):
  """Testing the login view and the logout"""
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

  def test_LoginView_invalidPassword(self):
    response = self.login(password="wrong")

    self.assertEqual(response.status_code, 401)
    self.assertEqual(response.reason_phrase.lower(), 'unauthorized')
    self.assertEqual(response.data['status'].lower(), 'unauthorized')
    self.assertEqual(response.data['message'], 'Username/password combination invalid.')

  def test_LoginView_deactivatedAccount(self):
    self.user.is_active = False
    self.user.save()
    response = self.login()

    self.assertEqual(response.status_code, 401)
    self.assertEqual(response.reason_phrase.lower(), 'unauthorized')
    self.assertEqual(response.data['status'].lower(), 'unauthorized')
    self.assertEqual(response.data['message'], 'This account has been disabled.')

  def test_LogoutView_validLogoutEvent(self):
    # First, login and validate that login
    self.test_LoginView_validUserLogin()

    response = self.client.post('/api/v1/auth/logout/')

    self.assertEqual(response.status_code, 204)
    self.assertEqual(response.reason_phrase.lower() ,'no content')
