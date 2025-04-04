from django.urls import path
from django.contrib import admin
from .views import (
    home, UserListView, UserDetailView, RoomListView, RoomDetailView, EventListView, EventDetailView,
    ParticipationListView, ParticipationDetailView, EventRoomDetailView, EventRoomListView, EventDetailWithOrganizerView, EventListWithOrganizerView, LoginView
)

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    
     # Users
    path('api/users/', UserListView.as_view(), name='user-list'),
    path('api/users/<int:user_id>/', UserDetailView.as_view(), name='user-detail'),

    # Login
    path('api/login/', LoginView.as_view(), name='user-login'),

    # Rooms
    path('api/rooms/', RoomListView.as_view(), name='room-list'),
    path('api/rooms/<int:room_id>/', RoomDetailView.as_view(), name='room-detail'),

    # Events
    path('api/events/', EventListView.as_view(), name='event-list'),
    path('api/events/<int:event_id>/', EventDetailView.as_view(), name='event-detail'),
    path('api/events/<int:event_id>/with-organizer/', EventDetailWithOrganizerView.as_view(), name='event-with-organizer'),
    path('api/events/with-organizer/', EventListWithOrganizerView.as_view(), name='event-list-with-organizer'),

    # Participation
    path('api/participations/', ParticipationListView.as_view(), name='participation-list'),
    path('api/participations/<int:event_id>/<int:user_id>/', ParticipationDetailView.as_view(), name='participation-detail'),

    # EventRooms
    path('api/eventrooms/', EventRoomListView.as_view(), name='eventroom-list'),
    path('api/eventrooms/<int:event_room_id>/', EventRoomDetailView.as_view(), name='eventroom-detail')

]