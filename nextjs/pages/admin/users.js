import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Use useRouter from next/router for redirection
import useBearStore from "@/store/useBearStore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";

const UsersPage = () => {
  const router = useRouter(); // Use useRouter for redirection
  const isAdmin = useBearStore((state) => state.isAdmin); // Check if the user is an admin
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [editUser, setEditUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login"); // Redirect to login if not an admin
    } else {
      fetchUsers(); // Fetch users if admin
    }
  }, [isAdmin, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      // Sort users by user_id in ascending order
      const sortedUsers = data.sort((a, b) => a.user_id - b.user_id);
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEditOpen = (user) => {
    setEditUser(user);
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setEditUser(null);
  };

  const handleEditSubmit = async () => {
    if (!editUser) return;

    try {
      const response = await fetch(`/api/users/${editUser.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: editUser.username,
          email: editUser.email,
          password_hash: editUser.password_hash || undefined,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(
          users.map((user) =>
            user.user_id === updatedUser.user_id ? updatedUser : user
          )
        );
        handleEditClose();
      } else {
        const errorData = await response.json();
        console.error("Failed to update user:", errorData.detail);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteOpen = (userId) => {
    setUserToDelete(userId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/users/${userToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.user_id !== userToDelete));
        handleDeleteClose();
        console.log("User deleted successfully");
      } else {
        const errorData = await response.json();
        setDeleteError(errorData.detail || "Failed to delete user");
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#000",
        minHeight: "100vh",
        color: "#ffffff",
      }}
    >
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search by Username or Email"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
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
          InputProps={{
            style: { color: "#ffffff" }, // Ensure the input text is white
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: "#000" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#ffffff" }}>User ID</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Username</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Email</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Created Date</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Status</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(filteredUsers) &&
              filteredUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell sx={{ color: "#ffffff" }}>{user.user_id}</TableCell>
                  <TableCell sx={{ color: "#ffffff" }}>{user.username}</TableCell>
                  <TableCell sx={{ color: "#ffffff" }}>{user.email}</TableCell>
                  <TableCell sx={{ color: "#ffffff" }}>
                    {new Date(user.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ color: "#ffffff" }}>
                    {user.status === 1 ? "Admin" : "User"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditOpen(user)}
                      sx={{ color: "#ffffff" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteOpen(user.user_id)}
                      sx={{ color: "#ffffff" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditClose}>
        <DialogTitle sx={{ color: "#ffffff", backgroundColor: "#333333" }}>
          Edit User
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#2e2e2e", color: "#ffffff" }}>
          {editUser && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Username"
                type="text"
                fullWidth
                variant="outlined"
                value={editUser.username}
                onChange={(e) =>
                  setEditUser({ ...editUser, username: e.target.value })
                }
                sx={{
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
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                sx={{
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
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#333333" }}>
          <Button onClick={handleEditClose} sx={{ color: "#ffffff" }}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} sx={{ color: "#ffffff" }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteClose}>
        <DialogTitle sx={{ color: "#ffffff", backgroundColor: "#d32f2f" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <WarningIcon sx={{ color: "#ffffff", marginRight: 1 }} />
            Confirm Deletion
          </Box>
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#d32f2f", color: "#ffffff" }}>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#d32f2f" }}>
          <Button onClick={handleDeleteClose} sx={{ color: "#ffffff" }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} sx={{ color: "#ffffff" }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
