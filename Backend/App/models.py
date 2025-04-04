from django.db import models
from django.contrib.auth.hashers import make_password, check_password

ROLE_CHOICES = [
    ('user', 'User'),
    ('admin', 'Admin'),
    ('event_manager', 'Event Manager'),
]

class User(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES) 

    def __str__(self):
        return f"{self.name} {self.surname} ({self.username})"
    
    def set_password(self, raw_password):
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password_hash)

class Room(models.Model):
    name = models.CharField(max_length=255)
    capacity = models.IntegerField()

    def __str__(self):
        return self.name

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date_from = models.DateField()
    date_to = models.DateField()
    time_start = models.TimeField()
    time_end = models.TimeField()
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_events')
    capacity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Participation(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    required = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')  # Prevent duplicate participations

    def __str__(self):
        return f"{self.user.username} -> {self.event.title}"

class EventRoom(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.event.title} in {self.room.name}"
