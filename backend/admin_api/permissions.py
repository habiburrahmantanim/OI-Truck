from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """
    Allows access only to authenticated users
    whose role is ADMIN.
    """

    message = "Admin access required."

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        return str(getattr(user, "role", "")).lower() == "admin"