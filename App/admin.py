from django.contrib import admin
from .models import User, Room, Event, Participation, EventRoom

admin.site.register(User)
admin.site.register(Room)
admin.site.register(Event)
admin.site.register(Participation)
admin.site.register(EventRoom)
