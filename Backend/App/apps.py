from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.contrib.auth import get_user_model

class MyappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'App'

    def ready(self):
            post_migrate.connect(create_default_superuser, sender=self)

def create_default_superuser(sender, **kwargs):
    User = get_user_model()
    if not User.objects.filter(is_superuser=True).exists():
        User.objects.create_superuser(
            username='admin', 
            email='', 
            password='admin'
        )