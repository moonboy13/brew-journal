from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers

from authentication.models import Account

class AccountSerializer(serializers.ModelSerializer):
  """Serializer for the Account table"""

  password         = serializers.CharField(write_only=True, required=False)
  confirm_password = serializers.CharField(write_only=True, required=False)

  class Meta:
    model  = Account
    fields = ('id', 'email', 'username', 'created_at', 'updated_at',
          'first_name', 'last_name', 'password',
          'confirm_password',)
    read_only_fields = ('create_at', 'updated_at',)

    def create(self, validated_data):
      return Account.objects.create(**validated_data)

    def update(self, instance, validated_data):
      instance.username = validated_data.get('username', instance.username)

      instance.save()

      password         = validated_data.get('password',         None)
      confirm_password = validated_data.get('confirm_password', None)

      # Only update the user's password if they have entered a new one
      if password and confirm_password and password == confirm_password:
        instance.set_password(password)
        instance.save()

      # Changes to the user object can change their authentication signature. As such we'll
      # want to update it so they don't have to re-login every time they edit their account.
      update_session_auth_hash(self.context.get('request'), instance)

      return instance
