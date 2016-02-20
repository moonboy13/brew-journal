import json, logging

from django.test import TestCase

from authentication.models import Account

from authentication.views import LoginView

# Test Authentication models
class TestAccountModel(TestCase):
  """Testing of the Account model"""

  @staticmethod
  def get_user():
    """Either retrieve the fake user or create it"""
    user_obj, created = Account.objects.get_or_create(username='foo',password='bar',defaults={'email':'fake@test.com','first_name':'john','last_name':'doe'})
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

  logger = logging.getLogger(__name__)

  user = TestAccountModel.get_user()
  logger.info(user)

  def test_user_login(self):
    # urls = reverse('authentication.views.LoginView')
    # logger.info(urls)
    self.assertTrue(True)
