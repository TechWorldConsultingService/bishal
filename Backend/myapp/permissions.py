from rest_framework import permissions

class IsSuperUserOrReadOnly(permissions.BasePermission):
    """
    Allow anyone to read (GET, HEAD, OPTIONS), 
    but only superusers can POST, PUT, PATCH, DELETE.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_superuser
