from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class Role(models.TextChoices):
        CUSTOMER = "customer", "Customer"
        DRIVER = "driver", "Driver"
        ADMIN = "admin", "Admin"

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER,
    )

    # Add these two fields to resolve reverse accessor clashes
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="account_users",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="account_users_permissions",
        blank=True,
    )

    def __str__(self):
        return self.username