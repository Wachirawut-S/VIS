import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useBearStore from "@/store/useBearStore";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Grid,
  IconButton,
  Divider,
  Avatar,
  CircularProgress, // Import CircularProgress for loading indicator
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import styles from "@/styles/forum.module.css";

const Forum = () => {
  const router = useRouter();
  const isLoggedIn = useBearStore((state) => state.isLoggedIn);
  const user_id = useBearStore((state) => state.user_id);
  const username = useBearStore((state) => state.username);
  const isAdmin = useBearStore((state) => state.isAdmin);
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [isPostBoxOpen, setIsPostBoxOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [replyContent, setReplyContent] = useState({});
  const [openReplyField, setOpenReplyField] = useState({});
  const [editPostId, setEditPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // New state to manage replies
  const [replies, setReplies] = useState({});
  const [showReplies, setShowReplies] = useState({});

  // New state for search
  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchSP500 = async () => {
      try {
        const response = await fetch("/api/sp500");
        if (!response.ok) {
          throw new Error("Failed to fetch SP500 data");
        }
        const data = await response.json();
        setSp500(data);
      } catch (error) {
        console.error("Error fetching SP500 data:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchSP500();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchLatestPosts();
    }
  }, [isLoggedIn, router]);

  const fetchLatestPosts = async () => {
    setLoading(true); // Show loading when fetching posts
    try {
      const response = await axios.get("/api/forum");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts", error);
    } finally {
      setLoading(false); // Hide loading after fetching posts
    }
  };

  const handlePostSubmit = async () => {
    if (title === "" || content === "") {
      setSnackbarMessage("Both title and content are required.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.post("/api/forum/create", {
        user_id,
        title,
        content,
      });
      setSnackbarMessage("Post created successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTitle("");
      setContent("");
      fetchLatestPosts();
      setIsPostBoxOpen(false);
    } catch (error) {
      setSnackbarMessage("Error creating post. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleReplySubmit = async (postId) => {
    if (replyContent[postId] === "") {
      setSnackbarMessage("Reply content is required.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.post("/api/forum/reply", {
        forum_id: postId,
        user_id,
        content: replyContent[postId],
      });

      setSnackbarMessage("Reply posted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setReplyContent({ ...replyContent, [postId]: "" });
      setOpenReplyField({ ...openReplyField, [postId]: false });
      fetchLatestPosts();
    } catch (error) {
      setSnackbarMessage("Error posting reply. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleReplyInputChange = (postId, content) => {
    setReplyContent({ ...replyContent, [postId]: content });
  };

  const toggleReplyField = (postId) => {
    setOpenReplyField({
      ...openReplyField,
      [postId]: !openReplyField[postId],
    });
  };

  const toggleEditField = (post) => {
    if (editPostId === post.forum_id) {
      setEditPostId(null);
      setEditTitle("");
      setEditContent("");
    } else {
      setEditPostId(post.forum_id);
      setEditTitle(post.title);
      setEditContent(post.content);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/api/forum/delete/${postId}`);
      setSnackbarMessage("Post deleted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      fetchLatestPosts();
    } catch (error) {
      setSnackbarMessage("Error deleting post. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleEditPost = async (postId) => {
    if (editTitle === "" || editContent === "") {
      setSnackbarMessage("Both title and content are required.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.put(`/api/forum/edit/${postId}`, {
        title: editTitle,
        content: editContent,
      });
      setSnackbarMessage("Post updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setEditPostId(null);
      setEditTitle("");
      setEditContent("");
      fetchLatestPosts();
    } catch (error) {
      setSnackbarMessage("Error updating post. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const fetchReplies = async (forumId) => {
    if (showReplies[forumId]) {
      setShowReplies({ ...showReplies, [forumId]: false });
      return;
    }

    try {
      const response = await axios.get(`/api/forum/${forumId}/replies`);
      setReplies({ ...replies, [forumId]: response.data });
      setShowReplies({ ...showReplies, [forumId]: true });
    } catch (error) {
      console.error("Error fetching replies", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter posts based on the search term
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Typography variant="h2" gutterBottom color="white">
        <strong>FORUMS</strong>
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        label="Search Posts"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{
          marginBottom: 4,
          input: { color: "#ffffff" },
          label: { color: "#ffffff" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#ffffff",
            },
            "&:hover fieldset": {
              borderColor: "#ffffff",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ffffff",
            },
          },
        }}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
              }}
            >
              <img
                src="/VIS_Background.png"
                alt="Loading"
                style={{ width: "30%", height: "auto", marginBottom: "20px" }}
              />
              <CircularProgress sx={{ color: "#ffffff" }} />
            </Box>
          ) : (

          <Paper
            sx={{
              padding: 3,
              marginBottom: 4,
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            
            {isPostBoxOpen ? (
              <>
              <Typography variant="h5" color="black">
                Create a new post
              </Typography>
                <TextField
                  fullWidth
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  required
                  helperText={title === "" ? "Title is required." : ""}
                  error={title === ""}
                />
                <TextField
                  fullWidth
                  label="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                  helperText={content === "" ? "Content is required." : ""}
                  error={content === ""}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setIsPostBoxOpen(false)}
                    sx={{ marginRight: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePostSubmit}
                  >
                    Post
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h5" color="black">
                Want to ask some question?
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsPostBoxOpen(true)}
              >
                Create Post
              </Button>
            </Box>
            )}
          </Paper>
      )}
        </Grid>

        {/* Displaying Filtered Posts */}
        <Grid item xs={12}>
          {filteredPosts.map((post) => (
            <Paper
              key={post.forum_id}
              className={styles.forumPost}
              sx={{ marginBottom: 2, padding: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ marginRight: 1 }}>{post.username.charAt(0)}</Avatar>
                    <Typography variant="h5" color="black">
                      {post.username}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'grey', borderWidth: 1, my: 2 }} />
              <Typography variant="h6" color="black">
                {post.title}
              </Typography>
              <Typography variant="body2" color="grey">
                {post.content}
              </Typography>
                
              <Typography variant="caption" color="gray">
                    Posted by {post.username} on {new Date(post.created_at).toLocaleString()}
                  </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <IconButton onClick={() => toggleReplyField(post.forum_id)}>
                    <ReplyIcon />
                  </IconButton>
                  {isAdmin || post.user_id === user_id ? (
                        <>
                          <IconButton onClick={() => toggleEditField(post)}>
                            <EditIcon /> 
                          </IconButton> 
                        </>
                      ) : null}
                </Box>
                {editPostId === post.forum_id ? (
                  <>
                    <TextField
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Edit Title"
                      sx={{ width: '100%', marginRight: 1 }}
                    />
                    <TextField
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Edit Content"
                      multiline
                      rows={1}
                      sx={{ width: '100%', marginRight: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleEditPost(post.forum_id)}
                    >
                      Save
                    </Button>
                  </>
                ) : null}
              </Box>

              {openReplyField[post.forum_id] && (
                <Box sx={{ marginTop: 1 }}>
                  <TextField
                    fullWidth
                    value={replyContent[post.forum_id] || ""}
                    onChange={(e) => handleReplyInputChange(post.forum_id, e.target.value)}
                    label="Write a reply..."
                    variant="outlined"
                    multiline
                    rows={2}
                  />
                  <Button
                    variant="contained"
                    sx={{ marginTop: 1 }}
                    onClick={() => handleReplySubmit(post.forum_id)}
                  >
                    Reply
                  </Button>
                </Box>
              )}

              <Box>
              <Divider sx={{ borderColor: 'grey', borderWidth: 1, my: 2 }} />
                <Button onClick={() => fetchReplies(post.forum_id)}>
                  <ExpandMoreIcon />
                  {showReplies[post.forum_id] ? "Hide Replies" : "Show Replies"}
                </Button>
                {showReplies[post.forum_id] && (
                  <Box sx={{ marginTop: 1 }}>
                    {replies[post.forum_id]?.map((reply) => (
                      <Box key={reply.reply_id} sx={{ marginBottom: 1 }}>
                        <Typography variant="body2" color="#333">
                        <Typography variant="caption" color="gray" marginRight="5px">
                              {reply.username} :
                            </Typography >
                          {reply.content} 
                        <Typography variant="caption" color="gray" marginLeft="10px">
                              Reply on {new Date(reply.created_at).toLocaleString()}
                            </Typography>
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Paper>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Forum;
 