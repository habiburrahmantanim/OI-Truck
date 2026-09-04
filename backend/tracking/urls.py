from django.urls import path

from .views import (
    TrackingListCreateView,
    TrackingDetailView,
)

urlpatterns = [
    path(
        "",
        TrackingListCreateView.as_view(),
        name="tracking-list-create",
    ),
    path(
        "<int:pk>/",
        TrackingDetailView.as_view(),
        name="tracking-detail",
    ),
]