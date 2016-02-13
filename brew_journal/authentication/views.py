import json

from django.shortcuts import render

from rest_framework import status, views, permissions, viewsets
from rest_framework.response import Response

from authentication.models import Account
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer

# Create your views here.
class AccountViewSet(viewsets.ModelViewSet):
  """Handle requests for any account editing events (sign-up, deletion, updating, etc.)"""
  lookup_field = 'username'
  queryset = Account.objects.all()
  serializer_class = AccountSerializer

  # Allowing any on a POST is probably overly permissive. This function is probably setup
  # with the thought that the only account editing that will occur is registration. Will
  # want to revisit logic when a page is made to edit account details.
  def get_permissions(self):
    """Retrieve the permissable actions for a request"""
    if self.request.method in permissions.SAFE_METHODS:
      return (permissions.AllowAny(),)

    if self.request.method == 'POST':
      return (permissions.AllowAny(),)

    return (permissions.IsAuthenticated(), IsAccountOwner(),)

  def create(self, request):
    serializer = self.serializer_class(data=request.data)

    if serializer.is_valid():
      Account.objects.create_user(**serializer.validated_data)

      return Response(serializer.validated_data, status=status.HTTP_201_created)

    return Response({
      'status':  'Bad Request',
      'message': 'Account could not be created with the received data.'
    }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
  """Handle the logging of the in for users"""
  def post(self, request, format=None):
    data = json.loads(request.body)

    username = data.get('username', None)
    password = data.get('password', None)

    account = authenticate(username=username, password=password)

    if account is not None:
      if account.is_active:
        login(request, account)

        serialized = AccountSerializer(account)

        return Response(serialized.data)
      else:
        return Response({
          'status':  'Unauthorized',
          'message': 'This account has been disabled.'
        }, status=status.HTTP_401_UNAUTHORIZED)
    else:
      return Response({
        'status':  'Unauthorized',
        'message': 'Username/password combination invalid.'
      }, status=status.HTTP_401_UNAUTHORIZED)