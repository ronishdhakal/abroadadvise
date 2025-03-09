import { useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";

const BlogComment = ({ blogSlug }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [name, setName] = useState(""); // ✅ Add name input
  const [email, setEmail] = useState(""); // ✅ Add email input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ✅ Fetch existing comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${blogSlug}/comments/`);
        if (!response.ok) throw new Error("Failed to fetch comments");

        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err.message);
        setError("Failed to load comments.");
      }
    };

    fetchComments();
  }, [blogSlug]);

  // ✅ Handle new comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !name.trim() || !email.trim()) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${blogSlug}/add-comment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name, // ✅ Include name
          email, // ✅ Include email
          comment: newComment, // ✅ Include comment
        }),
      });

      if (!response.ok) throw new Error("Failed to submit comment");

      const data = await response.json();
      setComments([data, ...comments]); // ✅ Update UI instantly
      setNewComment("");
      setName("");
      setEmail("");
      setSuccess("Comment submitted successfully and is pending approval.");
    } catch (err) {
      console.error("Error submitting comment:", err.message);
      setError("Failed to submit comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MessageCircle className="w-5 h-5 mr-2" /> Comments
      </h2>

      {/* Display existing comments */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <p className="text-sm font-medium text-gray-800">{comment.name || "Anonymous"}</p>
              <p className="text-sm text-gray-600 mt-1">{comment.comment}</p>
              <span className="text-xs text-gray-500">{comment.created_at}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mt-6 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white text-sm text-black"
        />

        <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 text-gray-800 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogComment;
