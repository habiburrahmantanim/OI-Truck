from django.urls import path
from .views import test_api, me

urlpatterns = [
    path("test/", test_api, name="test-api"),
    path("auth/me/", me, name="me"),
]