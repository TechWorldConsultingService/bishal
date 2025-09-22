from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from .views import LoginAPIView
from .views import *

urlpatterns = [
    path('api/login/', LoginAPIView.as_view(), name='api-login'),
    # path('api/logout/', LogoutAPIView.as_view(), name='api-logout'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    
    # Product URLs
    path('api/products/', ProductListView.as_view(), name='product-list'),
    path('api/products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('api/products/create/', ProductCreateView.as_view(), name='product-create'),
    path('api/products/<int:pk>/update/', ProductUpdateView.as_view(), name='product-update'),
    path('api/products/<int:pk>/delete/', ProductDeleteView.as_view(), name='product-delete'),

    # Category URLs
    path('api/categories/', CategoryListView.as_view(), name='category-list'),

    # SubCategory URLs
    path('api/subcategories/', SubCategoryListView.as_view(), name='subcategory-list'),

    # Brand URLs
    path('api/brands/', BrandListView.as_view(), name='brand-list'),

    # Subcategories by category
    path('api/categories/<int:category_id>/subcategories/', SubCategoryByCategoryView.as_view(), name='subcategory-by-category'),

    # Products by subcategory
    path('api/subcategories/<int:subcategory_id>/products/', ProductBySubCategoryView.as_view(), name='products-by-subcategory'),


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
