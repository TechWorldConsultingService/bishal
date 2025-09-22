

from rest_framework import permissions

class IsStaffOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["staff", "admin"]
    

from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsStaffOrAdminOrReadOnly(BasePermission):
    """
    GET requests → allowed for everyone.
    POST/PUT/PATCH/DELETE → only staff or admin.
    """

    def has_permission(self, request, view):
        # Allow all safe methods (GET, HEAD, OPTIONS) for everyone
        if request.method in SAFE_METHODS:
            return True

        # For other methods, check if user is staff/admin
        return request.user and request.user.is_authenticated and request.user.is_staff or request.user.role == "staff"
