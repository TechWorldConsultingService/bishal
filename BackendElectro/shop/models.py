from django.db import models

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # e.g. 8500.00
    category = models.CharField(max_length=100)
    image = models.ImageField(upload_to='products/', null=True, blank=True)

    def __str__(self):
        return self.name
