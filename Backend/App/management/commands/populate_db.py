from django.core.management.base import BaseCommand
from django.db import connection
from App.models import User, Room, Event, Participation, EventRoom
from datetime import date, time, timedelta
import random

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
        first_names = ["James", "Emma", "Michael", "Olivia", "Robert", "Sophia", "David", 
                      "Isabella", "John", "Ava", "Maria", "William", "Mia", "Carlos", 
                      "Charlotte", "Daniel", "Amelia", "Thomas", "Harper", "Alexander"]
        
        last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
                     "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
                     "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"]
        
        roles = ['admin', 'user', 'event_manager']
        
        users = []
        for i in range(1, 11):
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            username = f"{first_name.lower()}{last_name.lower()[:3]}{i}"
            
            user = User.objects.create(
                name=first_name,
                surname=last_name,
                username=username,
                email=f"{username}@example.com",
                role=random.choice(roles)
            )
            user.set_password("password")
            user.save()
            users.append(user)

        print("- created users")

        # Create Rooms
        room_names = ["Conference Hall", "Meeting Room A", "Meeting Room B", "Board Room", "Training Room"]
        rooms = [
            Room.objects.create(name=name, capacity=random.randint(10, 200))
            for name in room_names
        ]
        print("- created rooms")

        # Create Events with realistic names
        event_names = [
            "Quarterly Business Review", 
            "Annual Marketing Strategy Meeting",
            "New Product Launch: Project Phoenix",
            "Team Building Workshop",
            "IT Security Training",
            "Budget Planning for Q3",
            "Employee Onboarding Session",
            "Client Presentation: XYZ Corp",
            "Executive Leadership Summit",
            "HR Policy Review",
            "Sales Team Training",
            "Project Milestone Review",
            "Industry Conference Preparation",
            "Customer Feedback Session",
            "Year-End Performance Review"
        ]

        event_descriptions = [
            "Review of business performance and KPIs for the last quarter",
            "Planning our marketing strategy for the upcoming fiscal year",
            "Introducing our newest product line to the team",
            "Activities to improve team collaboration and communication",
            "Mandatory security training for all employees",
            "Financial planning and budget allocation for Q3",
            "Introduction session for new team members",
            "Presentation of our services to potential client XYZ Corporation",
            "Leadership skills development for executives",
            "Review and updates to company HR policies",
            "Training session for the sales department",
            "Review of completed project milestones and next steps",
            "Preparation for upcoming industry conference",
            "Session to collect and analyze customer feedback",
            "Annual employee performance evaluations"
        ]

        today = date.today()
        events = []
        for i in range(len(event_names)):
            start_date = today + timedelta(days=random.randint(1, 60))
            end_date = start_date + timedelta(days=random.randint(0, 1))
            start_time = time(hour=random.randint(8, 16), minute=0)
            end_time = time(hour=start_time.hour + random.randint(1, 3), minute=0)
            organizer = random.choice(users)
            event = Event.objects.create(
                title=event_names[i],
                description=event_descriptions[i],
                date_from=start_date,
                date_to=end_date,
                time_start=start_time,
                time_end=end_time,
                organizer=organizer,
                capacity=random.randint(10, 100)
            )
            events.append(event)

        print("- created events")

        # Assign Rooms to Events
        for event in events:
            room = random.choice(rooms)
            EventRoom.objects.create(event=event, room=room)

        print("- assigned rooms to events")

        # Add Participations
        for event in events:
            participants = random.sample(users, random.randint(1, len(users)))
            for user in participants:
                Participation.objects.create(
                    event=event, user=user, required=random.choice([True, False])
                )
                
        print("- added participations")

        self.stdout.write(self.style.SUCCESS("Database successfully populated with realistic sample data!"))
