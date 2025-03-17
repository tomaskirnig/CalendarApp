from django.core.management.base import BaseCommand
from django.db import connection
from App.models import User, Room, Event, Participation, EventRoom
from datetime import date, time

class Command(BaseCommand):
    help = "Wipe the database (including resetting IDs) and populate it with sample data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Wiping the database...")

        # Delete child tables first to avoid integrity errors
        Participation.objects.all().delete()
        EventRoom.objects.all().delete()
        Event.objects.all().delete()
        Room.objects.all().delete()
        User.objects.all().delete()

        # Reset the auto-increment ID sequence for each table
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='App_user';")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='App_room';")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='App_event';")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='App_participation';")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='App_eventroom';")

        self.stdout.write(self.style.SUCCESS("Database wiped and ID sequences reset!"))

        self.stdout.write("Populating the database with sample data...")

        # Create Users
        user1 = User.objects.create(
            name="John", surname="Doe", username="johndoe",
            email="john@example.com", password_hash="hashedpassword", role="admin"
        )
        user2 = User.objects.create(
            name="Alice", surname="Smith", username="alicesmith",
            email="alice@example.com", password_hash="hashedpassword", role="user"
        )
        user3 = User.objects.create(
            name="Bob", surname="Brown", username="bobbrown",
            email="bob@example.com", password_hash="hashedpassword", role="user"
        )
        user4 = User.objects.create(
            name="Emma", surname="Wilson", username="emmawilson",
            email="emma@example.com", password_hash="hashedpassword", role="user"
        )
        user5 = User.objects.create(
            name="Charlie", surname="Davis", username="charliedavis",
            email="charlie@example.com", password_hash="hashedpassword", role="user"
        )

        print("- created users")

        # Create Rooms
        room1 = Room.objects.create(name="Conference Hall", capacity=100)
        room2 = Room.objects.create(name="Small Meeting Room", capacity=10)
        room3 = Room.objects.create(name="Board Room", capacity=20)
        room4 = Room.objects.create(name="Training Room", capacity=30)
        room5 = Room.objects.create(name="Outdoor Pavilion", capacity=200)

        print("- created rooms users")

        # Create Events (Updated for date_from and date_to)
        event1 = Event.objects.create(
            title="Tech Conference", description="Annual Tech Conference",
            date_from=date(2025, 3, 20), date_to=date(2025, 3, 21),  # date_to = date_from + 1 day
            time_start=time(9, 0), time_end=time(17, 0),
            organizer=user1, capacity=50
        )
        event2 = Event.objects.create(
            title="Team Meeting", description="Monthly team meeting",
            date_from=date(2025, 3, 22), date_to=date(2025, 3, 22),
            time_start=time(14, 0), time_end=time(15, 0),
            organizer=user2, capacity=8
        )
        event3 = Event.objects.create(
            title="Workshop on AI", description="Hands-on workshop on Artificial Intelligence",
            date_from=date(2025, 3, 25), date_to=date(2025, 3, 26),
            time_start=time(10, 0), time_end=time(13, 0),
            organizer=user3, capacity=30
        )
        event4 = Event.objects.create(
            title="Yoga Session", description="Morning yoga session for employees",
            date_from=date(2025, 3, 26), date_to=date(2025, 3, 26),
            time_start=time(7, 0), time_end=time(8, 0),
            organizer=user4, capacity=15
        )
        event5 = Event.objects.create(
            title="Product Launch", description="Launch of the new product line",
            date_from=date(2025, 3, 28), date_to=date(2025, 3, 29),
            time_start=time(16, 0), time_end=time(18, 0),
            organizer=user5, capacity=100
        )

        print("- created events")

        # Assign Rooms to Events
        EventRoom.objects.create(event=event1, room=room1)
        EventRoom.objects.create(event=event2, room=room2)
        EventRoom.objects.create(event=event3, room=room3)
        EventRoom.objects.create(event=event4, room=room4)
        EventRoom.objects.create(event=event5, room=room5)

        print("- assigned rooms to events")

        # Add Participations
        Participation.objects.create(event=event1, user=user2, required=True)
        Participation.objects.create(event=event2, user=user1, required=False)
        Participation.objects.create(event=event1, user=user3, required=True)
        Participation.objects.create(event=event1, user=user4, required=False)
        Participation.objects.create(event=event2, user=user3, required=True)
        Participation.objects.create(event=event3, user=user5, required=False)
        Participation.objects.create(event=event4, user=user2, required=True)
        Participation.objects.create(event=event5, user=user1, required=False)
        Participation.objects.create(event=event5, user=user4, required=True)

        print("- added participations")

        self.stdout.write(self.style.SUCCESS("Database successfully populated with sample data!"))
