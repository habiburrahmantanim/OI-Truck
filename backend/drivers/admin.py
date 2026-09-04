from django.contrib import admin

from .models import Driver


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "phone",
        "license_number",
        "truck_number",
        "status",
        "rating",
        "total_trips",
        "created_at",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "user__username",
        "user__email",
        "phone",
        "license_number",
        "truck_number",
    )

    readonly_fields = (
        "rating",
        "total_trips",
        "created_at",
        "updated_at",
    )