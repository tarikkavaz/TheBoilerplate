from django.contrib import admin
from django.forms import widgets
from django.utils.safestring import mark_safe
from django.utils.html import format_html
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.contrib.auth.models import User, Group
from .models import Category, Tag, Post, Page, Image, HomePage, MenuItem, Social
from ckeditor.widgets import CKEditorWidget
from django import forms
from django.contrib.admin import AdminSite
from adminsortable2.admin import SortableAdminMixin, SortableInlineAdminMixin
from .forms import PageAdminForm, PostAdminForm
from .widgets import ImageThumbnailSelectWidget, ImageThumbnailWidget

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

class BaseImageInline(admin.TabularInline):
    extra = 1
    verbose_name = 'Image'
    verbose_name_plural = 'Images'
    readonly_fields = ('image_thumbnail',)

    def image_thumbnail(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="150" />', obj.image.image.url)
        return '- No Image -'
    image_thumbnail.short_description = 'Thumbnail'

class ImageInlinePage(BaseImageInline):
    model = Page.images.through

class ImageInlinePost(BaseImageInline):
    model = Post.images.through

class ImageInlineHomePage(BaseImageInline):
    model = HomePage.images.through

class ImageAdmin(admin.ModelAdmin):
    list_display = ('alt_text', 'image_thumbnail')

class PostAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget())
    images = forms.ModelChoiceField(queryset=Image.objects.all(),
                                widget=ImageThumbnailWidget,
                                required=False)
    
    class Meta:
        model = Post
        fields = '__all__'

class PostAdmin(SortableAdminMixin, admin.ModelAdmin):
    form = PostAdminForm
    inlines = [ImageInlinePost]
    readonly_fields = ('image_thumbnail',)

    def image_thumbnail(self, obj):
        if obj.image and hasattr(obj.image.image, 'url'):
            return format_html('<img src="{}" width="150" />', obj.image.image.url)
        return '- No Image -'
    image_thumbnail.short_description = 'Selected Cover Image Thumbnail'

    fieldsets = (
        ('Post', {
            'fields': ('lang', 'title', 'slug', 'pageinfo', 'langslug', 'image', 'image_thumbnail', 'content', 'categories', 'tags'),
        }),
    )
    list_display = ('title', 'lang', 'order')
    list_filter = ('lang',)

class PageAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget())
    images = forms.ModelChoiceField(queryset=Image.objects.all(),
                                widget=ImageThumbnailWidget,
                                required=False)
    
    class Meta:
        model = Page
        fields = '__all__'

class PageAdmin(SortableAdminMixin, admin.ModelAdmin):
    form = PageAdminForm
    inlines = [ImageInlinePage]
    readonly_fields = ('image_thumbnail',)

    def image_thumbnail(self, obj):
        if obj.image and hasattr(obj.image.image, 'url'):
            return format_html('<img src="{}" width="150" />', obj.image.image.url)
        return '- No Image -'
    image_thumbnail.short_description = 'Selected Cover Image Thumbnail'
    fieldsets = (
        ('Page', {
            'fields': ('lang', 'title', 'slug', 'pageinfo', 'langslug', 'image', 'image_thumbnail', 'content'),
        }),
    )
    list_display = ('title', 'lang', 'order')
    list_filter = ('lang',)

class HomePageAdmin(admin.ModelAdmin):
    inlines = [ImageInlineHomePage]
    fieldsets = (
        ('HomePage', {
            'fields': ('lang', 'title', 'pageinfo', 'content', 'posts'),
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

class SocialAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('order',)
    fields = ('facebook', 'twitter', 'instagram', 'threads', 'youtube', 'order')

my_admin_site.register(MenuItem, MenuItemAdmin)
my_admin_site.register(Category)
my_admin_site.register(Tag)
my_admin_site.register(Post, PostAdmin)
my_admin_site.register(Page, PageAdmin)
my_admin_site.register(Image, ImageAdmin)
my_admin_site.register(HomePage, HomePageAdmin)
my_admin_site.register(Social, SocialAdmin)
