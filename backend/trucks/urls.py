from django.urls import path

from .views import (
    TruckListCreateView,
    TruckDetailView,
)


urlpatterns = [
    path(
        "",
        TruckListCreateView.as_view(),
        name="truck-list-create",
    ),

    path(
        "<int:pk>/",
        TruckDetailView.as_view(),
        name="truck-detail",
    ),
]