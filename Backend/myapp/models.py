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


# .................... SHop DETAIL....................................
class Shop(models.Model):
    name    = models.CharField(max_length=250, unique=True)
    address = models.CharField(max_length=250, null=True, blank=True)
    p_num = models.CharField(max_length=15)
    s_num = models.CharField(max_length=15,null=True, blank=True)
    logo = models.ImageField(upload_to="logo/", null=True, blank=True)
    whatsapp = models.CharField(max_length=15)
    facebook = models.URLField(null=True, blank=True)
    instagram = models.URLField(null=True, blank=True)
    twitter = models.URLField(null=True, blank=True)
    youtube = models.URLField(null=True, blank=True)
    tiktok = models.URLField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    def __str__(self):
        return self.name


class HeroSectionBanner(models.Model):
    title = models.CharField(max_length=250, null=True, blank=True)
    subtitle = models.CharField(max_length=250,null=True, blank=True)
    image = models.ImageField(upload_to="HeroSectionBanner/", null=True, blank=True)

    def __str__(self):
        return self.title

class AdBanner(models.Model):
    image = models.ImageField(upload_to="AdBanner/", null=True, blank=True)

    def __str__(self):
        return self.image


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
    product_code = models.CharField(max_length=50,blank=True, null=True)
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
