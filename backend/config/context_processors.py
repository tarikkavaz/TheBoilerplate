from django.conf import settings

def nextjs_url(request):
    return {'NEXTJS_URL': settings.NEXTJS_URL}