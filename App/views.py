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
# @method_decorator(csrf_exempt, name='dispatch')
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


# @method_decorator(csrf_exempt, name='dispatch')
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
# @method_decorator(csrf_exempt, name='dispatch')
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


# @method_decorator(csrf_exempt, name='dispatch')
class RoomDetailView(View):
    def delete(self, request, room_id):
        """Delete a room"""
        deleted, _ = Room.objects.filter(id=room_id).delete()
        return JsonResponse({'message': 'Room deleted'} if deleted else {'error': 'Room not found'}, status=200 if deleted else 404)

# --- EVENTS ---
# @method_decorator(csrf_exempt, name='dispatch')
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


# @method_decorator(csrf_exempt, name='dispatch')
class EventDetailView(View):
    def delete(self, request, event_id):
        """Delete an event"""
        deleted, _ = Event.objects.filter(id=event_id).delete()
        return JsonResponse({'message': 'Event deleted'} if deleted else {'error': 'Event not found'}, status=200 if deleted else 404)

# --- PARTICIPATIONS ---
# @method_decorator(csrf_exempt, name='dispatch')
class ParticipationListView(View):
    def post(self, request):
        """Add a user to an event"""
        data = json.loads(request.body)
        user = User.objects.filter(id=data['user_id']).first()
        event = Event.objects.filter(id=data['event_id']).first()
        if not user or not event:
            return JsonResponse({'error': 'User or Event not found'}, status=404)

        participation, created = Participation.objects.get_or_create(user=user, event=event, required=data.get('required', False))
        return JsonResponse({'message': 'Participation added', 'id': participation.id} if created else {'error': 'Already participating'})


# @method_decorator(csrf_exempt, name='dispatch')
class ParticipationDetailView(View):
    def delete(self, request, event_id, user_id):
        """Remove a user from an event"""
        deleted, _ = Participation.objects.filter(event_id=event_id, user_id=user_id).delete()
        return JsonResponse({'message': 'Participation removed'} if deleted else {'error': 'Not participating'}, status=200 if deleted else 404)
