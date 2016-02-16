from django.test import TestCase

from authentication.models import Account

# Test Authentication models
class TestAccountModel(TestCase):
  """Basic tests"""

  def create_user(self):
    return Account.objects.create(username='foo',password='bar',email='fake@test.com',first_name='john',last_name='doe')

  def test_user_model(self):
    user = self.create_user()
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