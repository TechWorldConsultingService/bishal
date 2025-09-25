from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        """
        Disable normal user creation.
        """
        raise ValueError("Normal user creation is not allowed. Only superusers can be created.")

    def create_superuser(self, username, password=None, **extra_fields):
        """
        Create and return a superuser.
        """
        if not username:
            raise ValueError('Superuser must have a username')
        if not password:
            raise ValueError('Superuser must have a password')

        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        user = self.model(username=username, role='admin', **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


class CustomUser(AbstractUser):
    role = models.CharField(max_length=50, default="admin")

    # Attach the custom manager
    objects = CustomUserManager()


# .................... SHOP PRODUCT DETAIL....................................
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True, blank=True,   # optional
        related_name="subcategories"
    )
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.category.name if self.category else 'No Category'})"


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="products"
    )
    subcategory = models.ForeignKey(
        SubCategory,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="products"
    )
    brand = models.ForeignKey(
        Brand,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="products"
    )

    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='products/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
