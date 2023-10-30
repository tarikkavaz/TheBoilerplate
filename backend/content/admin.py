from django.contrib import admin
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.contrib.auth.models import User, Group
from .models import Category, Tag, Post, Page, Image, HomePage, MenuItem
from ckeditor.widgets import CKEditorWidget
from django import forms
from django.contrib.admin import AdminSite
from adminsortable2.admin import SortableAdminMixin

# Define a custom order for apps and models
APP_ORDER = {
    'content': 1,
    'auth': 2,
}

MODEL_ORDER = {
    'user': 1,
    'group': 2,
    'homepage': 1,
    'menuitem': 2,
    'page': 3,
    'post': 4,
    'image': 5,
    'category': 6,
    'tag': 7,
}

class CustomAdminSite(AdminSite):
    def get_app_list(self, request, app_label=None):
        app_dict = self._build_app_dict(request)

        app_list = sorted(app_dict.values(), key=lambda x: APP_ORDER.get(x['app_label'], 999))
        
        for app in app_list:
            app['models'].sort(key=lambda x: MODEL_ORDER.get(x['object_name'].lower(), 999))

        return app_list

my_admin_site = CustomAdminSite(name='my_admin')

my_admin_site.register(User, UserAdmin)
my_admin_site.register(Group, GroupAdmin)

class PostAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget())
    
    class Meta:
        model = Post
        fields = '__all__'

class PostAdmin(SortableAdminMixin, admin.ModelAdmin):
    form = PostAdminForm
    fieldsets = (
        ('Post', {
            'fields': ('lang', 'title', 'slug', 'pageinfo', 'langslug', 'image', 'content', 'images', 'categories', 'tags'),
        }),
    )
    list_display = ('title', 'lang', 'order')
    list_filter = ('lang',)

class PageAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget())
    
    class Meta:
        model = Page
        fields = '__all__'

class PageAdmin(SortableAdminMixin, admin.ModelAdmin):
    form = PageAdminForm
    fieldsets = (
        ('Page', {
            'fields': ('lang', 'title', 'slug', 'pageinfo', 'langslug', 'image', 'content', 'images'),
        }),
    )
    list_display = ('title', 'lang', 'order')
    list_filter = ('lang',)

class ImageAdmin(admin.ModelAdmin):
    list_display = ('alt_text', 'image_thumbnail')

class HomePageAdmin(admin.ModelAdmin):
    fieldsets = (
        ('HomePage', {
            'fields': ('lang', 'title', 'pageinfo', 'content', 'images', 'posts'),
        }),
    )
    list_display = ('title', 'lang')
    list_filter = ('lang',)

class MenuItemForm(forms.ModelForm):
    class Meta:
        model = MenuItem
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(MenuItemForm, self).__init__(*args, **kwargs)
        # Modify the initial value of the link field
        if self.instance.link and self.instance.link.startswith('/api/'):
            self.initial['link'] = self.instance.link[4:]

class MenuItemAdmin(SortableAdminMixin, admin.ModelAdmin):
    form = MenuItemForm
    list_display = ('title', 'lang', 'link', 'parent', 'page', 'order')
    fields = ('lang', 'title', 'order', 'parent', 'link', 'page')
    list_filter = ('lang',)

    @admin.display(description='Link')
    def modified_link(self, obj):
        # Remove the /api/ prefix from the link for the list display
        if obj.link and obj.link.startswith('/api/'):
            return obj.link[4:]
        return obj.link

my_admin_site.register(MenuItem, MenuItemAdmin)
my_admin_site.register(Category)
my_admin_site.register(Tag)
my_admin_site.register(Post, PostAdmin)
my_admin_site.register(Page, PageAdmin)
my_admin_site.register(Image, ImageAdmin)
my_admin_site.register(HomePage, HomePageAdmin) 
