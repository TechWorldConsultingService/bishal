from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout, authenticate
from .models import User
from .serializers import UserSerializer, RegisterStaffSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .permissions import IsAdmin

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not perform the csrf check

class RegisterStaffView(generics.CreateAPIView):
    serializer_class = RegisterStaffSerializer
    # authentication_classes = (CsrfExemptSessionAuthentication,)  # dev only
    permission_classes = [IsAdmin]

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

        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


        login(request, user)

        response_data = {
            "id": user.id,
            "role": user.role,
            "username": user.username,
            "email": user.email,
            # "first_name": user.first_name,
            # "last_name": user.last_name,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    
