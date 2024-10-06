import { useState, useEffect } from 'react';
import axios from 'axios';

// PostList component for displaying posts
function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.post_id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

// CreatePost component for creating a new post
function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/posts', { title, content });
      setTitle('');
      setContent('');
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <button type="submit">Create Post</button>
    </form>
  );
}

// Parent component to combine both PostList and CreatePost
export default function ForumPage() {
  return (
    <div>
      <h1>Forum</h1>
      <CreatePost />
      <PostList />
    </div>
  );
}
