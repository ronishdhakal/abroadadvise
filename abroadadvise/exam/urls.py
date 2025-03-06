from django.urls import path
from .views import ExamListView, create_exam, get_exam, update_exam, delete_exam, all_exams

urlpatterns = [
    path('', ExamListView.as_view(), name='list_exams'),  # ✅ Paginated list with filtering
    path('all/', all_exams, name='all_exams'),  # ✅ Fetch all exams (for frontend dropdown)
    path('create/', create_exam, name='create_exam'),
    path('<slug:slug>/', get_exam, name='get_exam'),
    path('<slug:slug>/update/', update_exam, name='update_exam'),
    path('<slug:slug>/delete/', delete_exam, name='delete_exam'),
]
