from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role"] 


class RegisterStaffSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    # def create(self, validated_data):
    #     request = self.context.get("request")
    #     if not request.user.is_authenticated or not request.user.is_superuser:
    #         raise serializers.ValidationError("Only admin can create staff.")

    #     validated_data['role'] = 'staff'
    #     return User.objects.create_user(**validated_data)


# class RegisterStaffSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = User
#         fields = ["id", "username", "email", "password"]

#     def create(self, validated_data):
#         """
#         Creates a new staff user with role='staff'.
#         Ensures password is hashed.
#         """

#         request = self.context.get("request")
#         if not request.user.is_superuser:
#             raise serializers.ValidationError("Only admin can create staff.")

#         validated_data['role'] = 'staff'
        
#         user = User.objects.create_user(
#             **validated_data
#             # username=validated_data["username"],
#             # email=validated_data.get("email"),
#             # password=validated_data["password"],
#             # role="staff"
#         )
#         return user
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data["username"], password=data["password"])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")