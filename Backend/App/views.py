from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import *
import json

def home(request):
    return render(request, 'index.html')

# --- USERS ---
@method_decorator(csrf_exempt, name='dispatch') # Disable CSRF protection - remove in production
class UserListView(View):
    def get(self, request):
        """Retrieve all users"""
        users = list(User.objects.values('id', 'name', 'surname', 'username', 'email', 'role'))
        return JsonResponse({'users': users})

    def post(self, request):
        """Create a new user"""
        data = json.loads(request.body)
        user = User.objects.create(
            name=data['name'], surname=data['surname'], username=data['username'],
            email=data['email'], password_hash=data['password_hash'], role=data['role']
        )
        return JsonResponse({'message': 'User created', 'id': user.id})


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request):
        """Login a user"""
        data = json.loads(request.body)
        user = User.objects.filter(email=data['email']).first()
        if user:
            if user.password_hash == data['password_hash']:
                return JsonResponse({'message': 'Login successful', 'user_id': user.id})
            else:
                return JsonResponse({'error': 'Invalid password'}, status=401)
        else:
            return JsonResponse({'error': 'User not found'}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class UserDetailView(View):
    def get(self, request, user_id):
        """Retrieve a single user"""
        user = User.objects.filter(id=user_id).values().first()
        return JsonResponse(user if user else {'error': 'User not found'}, status=404 if not user else 200)

    def put(self, request, user_id):
        """Update a user"""
        data = json.loads(request.body)
        updated = User.objects.filter(id=user_id).update(
            name=data.get('name', ''), surname=data.get('surname', ''),
            username=data.get('username', ''), email=data.get('email', ''),
            role=data.get('role', '')
        )
        return JsonResponse({'message': 'User updated'} if updated else {'error': 'User not found'}, status=200 if updated else 404)

    def delete(self, request, user_id):
        """Delete a user"""
        deleted, _ = User.objects.filter(id=user_id).delete()
        return JsonResponse({'message': 'User deleted'} if deleted else {'error': 'User not found'}, status=200 if deleted else 404)


# --- ROOMS ---
@method_decorator(csrf_exempt, name='dispatch')
class RoomListView(View):
    def get(self, request):
        """Retrieve all rooms"""
        rooms = list(Room.objects.values('id', 'name', 'capacity'))
        return JsonResponse({'rooms': rooms})

    def post(self, request):
        """Create a new room"""
        data = json.loads(request.body)
        room = Room.objects.create(name=data['name'], capacity=data['capacity'])
        return JsonResponse({'message': 'Room created', 'id': room.id})


@method_decorator(csrf_exempt, name='dispatch')
class RoomDetailView(View):
    def get(self, request, room_id):
        """Retrieve a single room"""
        room = Room.objects.filter(id=room_id).values().first()
        return JsonResponse(room if room else {'error': 'Room not found'}, status=404 if not room else 200)
    
    def put(self, request, room_id):
        """Update a room"""
        data = json.loads(request.body)
        updated = Room.objects.filter(id=room_id).update(
            name=data.get('name', ''), capacity=data.get('capacity', '')
        )
        return JsonResponse({'message': 'Room updated'} if updated else {'error': 'Room not found'}, status=200 if updated else 404)
    
    def delete(self, request, room_id):
        """Delete a room"""
        deleted, _ = Room.objects.filter(id=room_id).delete()
        return JsonResponse({'message': 'Room deleted'} if deleted else {'error': 'Room not found'}, status=200 if deleted else 404)

# --- EVENTS ---
@method_decorator(csrf_exempt, name='dispatch')
class EventListView(View):
    def get(self, request):
        """Retrieve all events"""
        events = list(Event.objects.values('id', 'title', 'description', 'date_from', 'date_to', 'time_start', 'time_end', 'organizer_id', 'capacity', 'created_at'))
        return JsonResponse({'events': events})

    def post(self, request):
        """Create a new event"""
        data = json.loads(request.body)
        organizer = User.objects.filter(id=data['organizer_id']).first()
        if not organizer:
            return JsonResponse({'error': 'Organizer not found'}, status=404)

        event = Event.objects.create(
            title=data['title'], description=data['description'], date_from=data['date_from'],
            date_to=data['date_to'], time_start=data['time_start'], time_end=data['time_end'],
            organizer=organizer, capacity=data['capacity']
        )
        return JsonResponse({'message': 'Event created', 'id': event.id})


@method_decorator(csrf_exempt, name='dispatch')
class EventDetailView(View):
    def get(self, request, event_id):
        """Retrieve a single event"""
        event = Event.objects.filter(id=event_id).values().first()
        return JsonResponse(event if event else {'error': 'Event not found'}, status=404 if not event else 200)
    
    def put(self, request, event_id):
        """Update an event"""
        data = json.loads(request.body)
        updated = Event.objects.filter(id=event_id).update(
            title=data.get('title', ''), description=data.get('description', ''),
            date_from=data.get('date_from', ''), date_to=data.get('date_to', ''),
            time_start=data.get('time_start', ''), time_end=data.get('time_end', ''),
            organizer_id=data.get('organizer_id', ''), capacity=data.get('capacity', '')
        )
        return JsonResponse({'message': 'Event updated'} if updated else {'error': 'Event not found'}, status=200 if updated else 404)
    
    def delete(self, request, event_id):
        """Delete an event"""
        deleted, _ = Event.objects.filter(id=event_id).delete()
        return JsonResponse({'message': 'Event deleted'} if deleted else {'error': 'Event not found'}, status=200 if deleted else 404)

@method_decorator(csrf_exempt, name='dispatch')
class EventDetailWithOrganizerView(View):
    def get(self, request, event_id):
        """Retrieve a single event with organizer details"""
        event = Event.objects.filter(id=event_id).first()
        
        if not event:
            return JsonResponse({'error': 'Event not found'}, status=404)
        
        # Convert event to dictionary
        event_data = {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'date_from': event.date_from,
            'date_to': event.date_to,
            'time_start': event.time_start,
            'time_end': event.time_end,
            'capacity': event.capacity,
            'created_at': event.created_at,
            'organizer': {
                'id': event.organizer.id,
                'name': event.organizer.name,
                'surname': event.organizer.surname,
                'username': event.organizer.username,
                'email': event.organizer.email
            }
        }
        
        return JsonResponse(event_data)
    
@method_decorator(csrf_exempt, name='dispatch')
class EventListWithOrganizerView(View):
    def get(self, request):
        """Retrieve all events with organizer details"""
        events = Event.objects.all()
        events_data = []

        for event in events:
            events_data.append({
                'id': event.id,
                'title': event.title,
                'description': event.description,
                'date_from': event.date_from,
                'date_to': event.date_to,
                'time_start': event.time_start,
                'time_end': event.time_end,
                'capacity': event.capacity,
                'created_at': event.created_at,
                'organizer': {
                    'id': event.organizer.id,
                    'name': event.organizer.name,
                    'surname': event.organizer.surname,
                    'username': event.organizer.username,
                    'email': event.organizer.email
                }
            })
        
        return JsonResponse({'events': events_data})

# --- PARTICIPATIONS ---
@method_decorator(csrf_exempt, name='dispatch')
class ParticipationListView(View):
    def get(self, request):
        """Retrieve all participations"""
        participations = list(Participation.objects.values('id', 'user_id', 'event_id', 'required'))
        return JsonResponse({'participations': participations})
    
    def post(self, request):
        """Add a user to an event"""
        data = json.loads(request.body)
        user = User.objects.filter(id=data['user_id']).first()
        event = Event.objects.filter(id=data['event_id']).first()
        if not user or not event:
            return JsonResponse({'error': 'User or Event not found'}, status=404)

        participation, created = Participation.objects.get_or_create(user=user, event=event, required=data.get('required', False))
        return JsonResponse({'message': 'Participation added', 'id': participation.id} if created else {'error': 'Already participating'})


@method_decorator(csrf_exempt, name='dispatch')
class ParticipationDetailView(View):
    def get(self, request, event_id, user_id):
        """Retrieve a single participation"""
        participation = Participation.objects.filter(event_id=event_id, user_id=user_id).values().first()
        return JsonResponse(participation if participation else {'error': 'Participation not found'}, status=404 if not participation else 200)
    
    def put(self, request, event_id, user_id):
        """Update a participation"""
        data = json.loads(request.body)
        updated = Participation.objects.filter(event_id=event_id, user_id=user_id).update(
            required=data.get('required', '')
        )
        return JsonResponse({'message': 'Participation updated'} if updated else {'error': 'Participation not found'}, status=200 if updated else 404)
    
    def delete(self, request, event_id, user_id):
        """Remove a user from an event"""
        deleted, _ = Participation.objects.filter(event_id=event_id, user_id=user_id).delete()
        return JsonResponse({'message': 'Participation removed'} if deleted else {'error': 'Not participating'}, status=200 if deleted else 404)

# --- EVENT-ROOMS ---
@method_decorator(csrf_exempt, name='dispatch')
class EventRoomListView(View):
    def get(self, request):
        """Retrieve all event-room assignments"""
        event_rooms = list(EventRoom.objects.values('id', 'event_id', 'room_id'))
        return JsonResponse({'event_rooms': event_rooms})
    
    def post(self, request):
        """Create a new event-room assignment"""
        data = json.loads(request.body)
        event = Event.objects.filter(id=data.get('event_id')).first()
        room = Room.objects.filter(id=data.get('room_id')).first()
        if not event or not room:
            return JsonResponse({'error': 'Event or Room not found'}, status=404)
        
        event_room = EventRoom.objects.create(event=event, room=room)
        return JsonResponse({'message': 'EventRoom created', 'id': event_room.id})
    
@method_decorator(csrf_exempt, name='dispatch')
class EventRoomDetailView(View):
    def get(self, request, event_room_id):
        """Retrieve a single event-room assignment"""
        event_room = EventRoom.objects.filter(id=event_room_id).values().first()
        return JsonResponse(event_room if event_room else {'error': 'EventRoom not found'}, status=404 if not event_room else 200)
    
    def put(self, request, event_room_id):
        """Update an event-room assignment"""
        data = json.loads(request.body)
        updated = EventRoom.objects.filter(id=event_room_id).update(
            event_id=data.get('event_id', ''), room_id=data.get('room_id', '')
        )
        return JsonResponse({'message': 'EventRoom updated'} if updated else {'error': 'EventRoom not found'}, status=200 if updated else 404)
    
    def delete(self, request, event_room_id):
        """Delete an event-room assignment"""
        deleted, _ = EventRoom.objects.filter(id=event_room_id).delete()
        return JsonResponse({'message': 'EventRoom deleted'} if deleted else {'error': 'EventRoom not found'}, status=200 if deleted else 404)