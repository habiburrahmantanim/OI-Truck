from django.urls import path

from .views import (
    AdminDashboardView,

    AdminUserListView,
    AdminUserDetailView,

    AdminBookingListView,
    AdminBookingDetailView,

    AdminTruckListView,
    AdminTruckDetailView,

    AdminDriverListView,
    AdminDriverDetailView,
)


urlpatterns = [

    # Dashboard
    path(
        "dashboard/",
        AdminDashboardView.as_view(),
        name="admin-dashboard",
    ),

    # Users
    path(
        "users/",
        AdminUserListView.as_view(),
        name="admin-users",
    ),

    path(
        "users/<int:pk>/",
        AdminUserDetailView.as_view(),
        name="admin-user-detail",
    ),

    # Bookings
    path(
        "bookings/",
        AdminBookingListView.as_view(),
        name="admin-bookings",
    ),

    path(
        "bookings/<int:pk>/",
        AdminBookingDetailView.as_view(),
        name="admin-booking-detail",
    ),

    # Trucks
    path(
        "trucks/",
        AdminTruckListView.as_view(),
        name="admin-trucks",
    ),

    path(
        "trucks/<int:pk>/",
        AdminTruckDetailView.as_view(),
        name="admin-truck-detail",
    ),

    # Drivers
    path(
        "drivers/",
        AdminDriverListView.as_view(),
        name="admin-drivers",
    ),

    path(
        "drivers/<int:pk>/",
        AdminDriverDetailView.as_view(),
        name="admin-driver-detail",
    ),
]