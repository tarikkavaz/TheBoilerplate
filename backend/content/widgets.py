from django import forms  # Import the forms module here
from django_select2.forms import Select2Widget, Select2MultipleWidget
from django.forms import widgets
from django.utils.safestring import mark_safe
from django.utils.html import format_html
from .models import Image  # Ensure you have imported your Image model

class ImageThumbnailMultipleSelectWidget(Select2MultipleWidget):  # Extend Select2MultipleWidget for multiple selections
    def render_option(self, selected_choices, option_value, option_label):
        if option_value:
            image = Image.objects.get(pk=option_value)
            thumbnail = format_html('<img src="{}" height="50" style="margin-right: 10px;"/>', image.image.url)
            option_label = format_html('{} {}', thumbnail, option_label)  # Use format_html instead of mark_safe
        return super().render_option(selected_choices, option_value, option_label)


class ImageThumbnailSelectWidget(Select2Widget):

    def render_option(self, *args):
        option_value, option_label = args[1], args[2]
        if option_value:
            image_url = Image.objects.get(pk=option_value).image.url
            return format_html('<option value="{}" data-thumbnail-url="{}">{} - {}</option>',
                              option_value, image_url, option_label, image_url)
        return super().render_option(*args)

class ImageThumbnailWidget(forms.Select):
    def render_option(self, selected_choices, option_value, option_label):
        if option_value:
            image = Image.objects.get(pk=option_value)
            thumbnail = format_html('<img src="{}" height="50" style="margin-right: 10px;"/>', image.image.url)
            option_label = mark_safe(f"{thumbnail} {option_label}")
        return super().render_option(selected_choices, option_value, option_label)
