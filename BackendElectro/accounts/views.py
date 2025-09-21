from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from .models import User
from .serializers import UserSerializer, RegisterStaffSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .permissions import IsAdmin

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not perform the csrf check


# Only Admin can create staff
# class RegisterStaffView(generics.CreateAPIView):
#     serializer_class = RegisterStaffSerializer
#     permission_classes = [permissions.IsAdminUser]                  # Only admin
#     authentication_classes = (CsrfExemptSessionAuthentication,)     # dev only

#     def get_serializer_context(self):
#         """
#         Pass request to serializer so we can check creator inside serializer.
#         """
#         context = super().get_serializer_context()
#         context.update({"request": self.request})
#         return context

class RegisterStaffView(generics.CreateAPIView):
    serializer_class = RegisterStaffSerializer
    authentication_classes = (CsrfExemptSessionAuthentication,)  # dev only
    permission_classes = [IsAdmin]

    # def get_permissions(self):
    #     """
    #     Explicitly deny if user is not superuser.
    #     """
    #     user = self.request.user
    #     if not user.is_authenticated or not user.is_superuser:
    #         self.permission_denied(
    #             self.request, message="Only admin can create staff."
    #         )
    #     return super().get_permissions()

    # def get_serializer_context(self):
    #     context = super().get_serializer_context()
    #     context.update({"request": self.request})
    #     return context

# Login view
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = (CsrfExemptSessionAuthentication,)  # ✅ disable CSRF

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)  # Django session login
        return Response({"message": "Login successful", "user": UserSerializer(user).data})

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    
