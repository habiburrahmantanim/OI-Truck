from django.contrib import admin

from .models import Truck


@admin.register(Truck)
class TruckAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "capacity",
        "category",
        "price",
        "available",
        "created_at",
    )

    list_filter = (
        "category",
        "available",
    )

    search_fields = (
        "name",
        "capacity",
        "category",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )