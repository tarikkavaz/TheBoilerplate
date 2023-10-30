from django import forms
from .models import Page, Post, Image
from .widgets import ImageThumbnailSelectWidget, ImageThumbnailWidget
from .widgets import ImageThumbnailMultipleSelectWidget
from ckeditor.widgets import CKEditorWidget

class PageAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget())
    image = forms.ModelChoiceField(queryset=Image.objects.all(),
                                  widget=ImageThumbnailWidget,
                                  required=False)

    class Meta:
        model = Page
        fields = '__all__'

class PostAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget())
    image = forms.ModelChoiceField(queryset=Image.objects.all(),
                                  widget=ImageThumbnailWidget,
                                  required=False)

    class Meta:
        model = Post
        fields = '__all__'