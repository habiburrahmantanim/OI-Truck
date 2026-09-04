from django.db import models

# Create your models here.


class Truck(models.Model):

    name = models.CharField(max_length=150)

    image = models.URLField(
        blank=True,
        null=True
    )

    capacity = models.CharField(
        max_length=50
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    category = models.CharField(
        max_length=100
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    ideal_for = models.JSONField(
        default=list,
        blank=True
    )

    available = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name