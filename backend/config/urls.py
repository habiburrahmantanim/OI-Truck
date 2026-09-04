from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    # Django admin
    path(
        "admin/",
        admin.site.urls,
    ),

    # Authentication
    path(
        "api/auth/",
        include("accounts.urls"),
    ),

    # Customer bookings
    path(
        "api/bookings/",
        include("bookings.urls"),
    ),

    # Trucks
    path(
        "api/trucks/",
        include("trucks.urls"),
    ),

    # Drivers
    path(
        "api/drivers/",
        include("drivers.urls"),
    ),

    # Admin API
    path(
        "api/admin/",
        include("admin_api.urls"),
    ),

    # Tracking
    path(
        "api/tracking/",
        include("tracking.urls"),
    ),
]