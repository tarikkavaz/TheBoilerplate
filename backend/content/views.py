from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Tag, Post, Page, Image, HomePage, MenuItem, Social
from .serializers import CategorySerializer, TagSerializer, PostSerializer, PageSerializer, ImageSerializer, HomePageSerializer, MenuItemSerializer, SocialSerializer

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryPostsView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        category = Category.objects.get(slug=slug)
        return Post.objects.filter(categories=category)

class TagPostsView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        tag = Tag.objects.get(slug=slug)
        return Post.objects.filter(tags=tag)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.all()
        if 'lang' in self.kwargs:
            queryset = queryset.filter(lang=self.kwargs['lang'])
        if 'category_slug' in self.kwargs:
            queryset = queryset.filter(categories__slug=self.kwargs['category_slug'])
        if 'tag_slug' in self.kwargs:
            queryset = queryset.filter(tags__slug=self.kwargs['tag_slug'])
        return queryset

    @action(detail=False, url_path='(?P<slug>[-\w]+)', methods=['get'])
    def by_slug(self, request, slug=None, *args, **kwargs):
        post = self.get_queryset().filter(slug=slug).first()
        if post:
            serializer = self.get_serializer(post)
            return Response(serializer.data)
        else:
            return Response({"detail": "Not found."}, status=404)

class PageViewSet(viewsets.ModelViewSet):
    serializer_class = PageSerializer

    def get_queryset(self):
        queryset = Page.objects.all()
        if 'lang' in self.kwargs:
            queryset = queryset.filter(lang=self.kwargs['lang'])
        if 'category_slug' in self.kwargs:
            queryset = queryset.filter(categories__slug=self.kwargs['category_slug'])
        if 'tag_slug' in self.kwargs:
            queryset = queryset.filter(tags__slug=self.kwargs['tag_slug'])
        return queryset
    
    @action(detail=False, url_path='(?P<slug>[-\w]+)', methods=['get'])
    def by_slug(self, request, slug=None, *args, **kwargs):
        post = self.get_queryset().filter(slug=slug).first()
        if post:
            serializer = self.get_serializer(post)
            return Response(serializer.data)
        else:
            return Response({"detail": "Not found."}, status=404)

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

class HomePageViewSet(viewsets.ModelViewSet):
    serializer_class = HomePageSerializer

    def get_queryset(self):
        queryset = HomePage.objects.all()
        if 'lang' in self.kwargs:
            queryset = queryset.filter(lang=self.kwargs['lang'])
        return queryset

class SocialViewSet(viewsets.ModelViewSet):
    queryset = Social.objects.all()
    serializer_class = SocialSerializer