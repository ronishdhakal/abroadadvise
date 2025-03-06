from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

User = get_user_model()

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # User who submitted the review
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)  # Generic relation (Consultancy/University)
    object_id = models.PositiveIntegerField()  # ID of the related object
    content_object = GenericForeignKey('content_type', 'object_id')  # Dynamic reference
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1 to 5 rating
    review_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)  # Admin moderation

    # ✅ New Reply Fields
    reply_text = models.TextField(blank=True, null=True)  # Reply content
    replied_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="review_replies")
    replied_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']  # Show latest reviews first

    def __str__(self):
        return f"{self.user.username} - {self.rating} Stars"
