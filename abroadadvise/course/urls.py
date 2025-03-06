from django.urls import path
from .views import CourseListView, create_course, get_course, update_course, delete_course

urlpatterns = [
    path('', CourseListView.as_view(), name='list_courses'),
    path('create/', create_course, name='create_course'),
    path('<slug:slug>/', get_course, name='get_course'),
    path('<slug:slug>/update/', update_course, name='update_course'),
    path('<slug:slug>/delete/', delete_course, name='delete_course'),
]
