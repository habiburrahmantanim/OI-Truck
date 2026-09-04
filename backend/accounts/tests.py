from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthApiTests(APITestCase):
	def test_register_accepts_email_only_identity(self):
		response = self.client.post(
			reverse("register"),
			{
				"email": "new@example.com",
				"password": "strong-password",
				"password_confirm": "strong-password",
				"first_name": "New",
				"last_name": "User",
				"phone": "0123456789",
				"role": "customer",
			},
		)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data["user"]["username"], "new@example.com")

	def test_login_accepts_email_and_me_returns_user(self):
		self.client.post(
			reverse("register"),
			{
				"email": "login@example.com",
				"password": "strong-password",
				"password_confirm": "strong-password",
				"role": "customer",
			},
		)

		response = self.client.post(
			reverse("login"),
			{"username": "LOGIN@example.com", "password": "strong-password"},
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn("access", response.data)
		self.assertIn("refresh", response.data)
		self.assertEqual(response.data["user"]["email"], "login@example.com")

		me_response = self.client.get(
			reverse("me"),
			HTTP_AUTHORIZATION=f"Bearer {response.data['access']}",
		)

		self.assertEqual(me_response.status_code, status.HTTP_200_OK)
		self.assertEqual(me_response.data["email"], "login@example.com")
