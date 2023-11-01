from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from ckeditor.fields import RichTextField
from django.utils.html import format_html
from django.core.validators import URLValidator

class MenuItem(models.Model):
    title = models.CharField(max_length=200)
    link = models.CharField(max_length=500, blank=True, null=True)
    parent = models.ForeignKey('self', blank=True, null=True, related_name='submenus', on_delete=models.CASCADE)
    page = models.ForeignKey('Page', blank=True, null=True, on_delete=models.SET_NULL)
    newtab = models.BooleanField(default=False, verbose_name="Open in new Tab")
    order = models.PositiveIntegerField(default=0, db_index=True)
    lang = models.CharField(max_length=7, choices=settings.LANGUAGES, default='en', blank=True, verbose_name="Language")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

    @property
    def is_submenu(self):
        return True if self.parent else False

    def save(self, *args, **kwargs):
        if self.page:
            self.link = reverse('page-detail', kwargs={'lang': self.page.lang, 'slug': self.page.slug})
        super().save(*args, **kwargs)

class Category(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Tag(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Post(models.Model):
    title = models.CharField(max_length=255, verbose_name="Post Title")
    slug = models.SlugField(max_length=255, unique=True, blank=True, verbose_name="Post URL")
    langslug = models.CharField(max_length=255, blank=True, verbose_name="Translation Link")
    pageinfo = models.TextField(blank=True, verbose_name="Page Description")
    content = RichTextField(verbose_name="Post Content")
    image = models.ForeignKey('Image', on_delete=models.SET_NULL, blank=True, null=True, verbose_name="Selected Cover Image", related_name="post_selected_image")
    images = models.ManyToManyField('Image', blank=True, verbose_name="Select Content Images", related_name="post_images")
    date_posted = models.DateTimeField(auto_now_add=True, blank=True)
    categories = models.ManyToManyField(Category, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    lang = models.CharField(max_length=7, choices=settings.LANGUAGES, default='en', blank=True, verbose_name="Language")
    order = models.PositiveIntegerField(default=0, editable=False, db_index=True)

    class Meta:
        ordering = ['order']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def image_url(self):
        return self.image.image.url if self.image else None

    @property
    def image_urls(self):
        return [image.image.url for image in self.images.all()]

class Page(models.Model):
    title = models.CharField(max_length=255, verbose_name="Page Title")
    slug = models.SlugField(max_length=255, unique=True, blank=True, verbose_name="Page URL")
    langslug =models.CharField(max_length=255, blank=True, verbose_name="Translation Link")
    # menu = models.BooleanField(default=True, verbose_name="Add to Menu")
    pageinfo = models.TextField(blank=True, verbose_name="Page Description")
    content = RichTextField(verbose_name="Page Content")
    image = models.ForeignKey('Image', on_delete=models.SET_NULL, blank=True, null=True, verbose_name="Selected Cover Image", related_name="page_selected_image")
    images = models.ManyToManyField('Image', blank=True, verbose_name="Select Content Images", related_name="page_images")
    lang = models.CharField(max_length=7, choices=settings.LANGUAGES, default='en', blank=True, verbose_name="Language")
    order = models.PositiveIntegerField(default=0, editable=False, db_index=True)
    
    
    class Meta:
        ordering = ['order']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
    @property
    def image_url(self):
        if self.image and hasattr(self.image.image, 'url'):
            return self.image.image.url
        return None

    @property
    def image_urls(self):
        return [image.image.url for image in self.images.all()]

class Image(models.Model):
    image = models.ImageField(upload_to='images/')
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.alt_text

    def image_thumbnail(self):
        return format_html('<img src="{}" height="50" />', self.image.url)
    image_thumbnail.short_description = 'Thumbnail'

class HomePage(models.Model):
    title = models.CharField(max_length=255, verbose_name="Site Title")
    pageinfo = models.TextField(blank=True, verbose_name="Site Description")
    content = RichTextField()
    images = models.ManyToManyField('Image', blank=True, verbose_name="Select Content Images", related_name="home_images")
    posts = models.ManyToManyField('Post', blank=True, verbose_name="Select Posts to display on Homepage")
    lang = models.CharField(max_length=7, choices=settings.LANGUAGES, default='en', blank=True, verbose_name="Language")

    def __str__(self):
        return self.title

class Social(models.Model):
    facebook = models.CharField(max_length=255, blank=True, validators=[URLValidator()])
    twitter = models.CharField(max_length=255, blank=True, validators=[URLValidator()])
    instagram = models.CharField(max_length=255, blank=True, validators=[URLValidator()])
    threads = models.CharField(max_length=255, blank=True, validators=[URLValidator()])
    youtube = models.CharField(max_length=255, blank=True, validators=[URLValidator()])
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ('order',)

    def save(self, *args, **kwargs):
        if not self.pk and Social.objects.exists():
            # if you'll not check for self.pk 
            # then error will also raised in update of exists model
            raise ValidationError('There is can be only one Social instance')
        super(Social, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError("Social instance can't be deleted")

    def __str__(self):
        return "Social Links"

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj