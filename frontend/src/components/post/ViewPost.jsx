import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";

const ViewPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };
    fetchPost();
  }, [id]);

  const navigate = useNavigate();

  const handleCommentSubmit = async () => {
    try {
      await axios.post(`http://localhost:5000/posts/${id}/comment`, {
        author: sessionStorage.authorName,
        body: comment,
      });
      setComment("");
      setCommentAuthor("");

      const res = await axios.get(`http://localhost:5000/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (!post) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md mt-8 rounded-xl">
      <img
        src={`http://localhost:5000/${post.image}`}
        alt={post.title}
        className="w-auto h-vh object-cover rounded-xl mb-4 max-w-xs"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        By <span className="font-semibold">{post.author}</span> •{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="text-lg text-gray-700 leading-relaxed mb-6">{post.body}</p>

      {/* Comment Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Comments</h2>
        <div className="space-y-3">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((cmt, idx) => (
              <div key={idx} className="border p-3 rounded-md bg-gray-50">
                <p className="text-sm text-gray-800 font-medium">
                  {cmt.author} •{" "}
                  <span className="text-gray-500 text-xs">
                    {new Date(cmt.postedAt).toLocaleString()}
                  </span>
                </p>
                <p className="text-gray-700 mt-1">{cmt.body}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <textarea
            rows="3"
            className="border rounded-md p-3 w-full"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
            >
              ← Back
            </button>

            <button
              onClick={handleCommentSubmit}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-900 transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPost;
