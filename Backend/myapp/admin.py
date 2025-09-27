from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Category, SubCategory, Brand, Product, Shop, HeroSectionBanner, AdBanner

# Custom User admin
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff', 'is_superuser')
    list_filter = ('role', 'is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('role', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'role', 'is_staff', 'is_superuser')}
        ),
    )
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Category)
admin.site.register(SubCategory)
admin.site.register(Brand)
admin.site.register(Product)



@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = (
        "id", 
        "name", 
        "address", 
        "p_num", 
        "s_num", 
        "whatsapp", 
        "email"
    )
    list_filter = ("address",)
    search_fields = ("name", "p_num", "whatsapp", "email")
    ordering = ("id",)
    readonly_fields = ()
    fieldsets = (
        ("Basic Information", {
            "fields": ("name", "address", "logo")
        }),
        ("Contact Details", {
            "fields": ("p_num", "s_num", "whatsapp", "email")
        }),
        ("Social Media Links", {
            "fields": ("facebook", "instagram", "twitter", "youtube", "tiktok")
        }),
    )

    # Optional: show logo thumbnail in admin list view
    def logo_preview(self, obj):
        if obj.logo:
            return f'<img src="{obj.logo.url}" width="50" height="50" style="object-fit:cover;" />'
        return "No Logo"
    logo_preview.allow_tags = True
    logo_preview.short_description = "Logo Preview"
    
@admin.register(HeroSectionBanner)
class HeroSectionBannerAdmin(admin.ModelAdmin):
    list_display = ("title", "subtitle")
    search_fields = ("title", "subtitle")

@admin.register(AdBanner)
class AdBannerAdmin(admin.ModelAdmin):
    list_display = ("id", "image")
