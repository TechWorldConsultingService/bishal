from django.urls import path
from .views import RegisterStaffView, LoginView, LogoutView

urlpatterns = [
    path("register-staff/", RegisterStaffView.as_view(), name="register-staff"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
]