from rest_framework import permissions

class IsAccountOwner(permissions.BasePermission):
  """Determine if a user is the owner of the account they want to alter"""

  def has_object_permission(self, request, view, account):
    if request.user:
      return account == request.user

    return False