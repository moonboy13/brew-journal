from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

# Create your models here.
class AccountManager(BaseUserManager):
  """Manager class for handling interactions with the Account model"""
  def create_user(self, username, password=None, **kwargs):
    if not username:
      raise ValueError('Users must have a valid username.')

    if not kwargs.get('email'):
      raise ValueError('Users must have a valid email address.')

    # TODO: Add graceful validation for the username, since its unique should offer unique names
    # upon failure
    account = self.model(
      username=username, email=self.normalize_email(kwargs.get('email'))
    )

    account.set_password(password)
    account.save()

    return account

  def create_superuser(self, email, password, **kwargs):
    account = self.create_user(email, password, **kwargs)

    account.is_admin = True
    account.save()

    return account


class Account(AbstractBaseUser):
  """Customized User model"""
  username = models.CharField(max_length=40, unique=True)

  email    = models.EmailField()

  first_name = models.CharField(max_length=40,  blank=True)
  last_name  = models.CharField(max_length=40,  blank=True)
  tagline    = models.CharField(max_length=140, blank=True)

  is_admin = models.BooleanField(default=False)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  objects = AccountManager()

  USERNAME_FIELD  = 'username'
  REQUIRED_FIELDS = ['email']

  def __unicode__(self):
    return self.username

  def get_full_name(self):
    return ' '.join([self.first_name, self.last_name])

  def get_short_name(self):
    return self.first_name