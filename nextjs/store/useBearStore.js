import { create } from "zustand";

const useBearStore = create((set) => ({
  appName: undefined, // Set the default app name to "VIS"
  isLoggedIn: false,
  username: null,
  user_id: null,
  isAdmin: false,
  setAppName: (newAppName) => set({ appName: newAppName }),
  setLogin: (username, user_id, isAdmin) => {
    set({ isLoggedIn: true, username, user_id, isAdmin });
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("username", username);
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("isAdmin", isAdmin.toString());
  },
  logout: () => {
    set({ isLoggedIn: false, username: null, user_id: null, isAdmin: false });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    localStorage.removeItem("isAdmin");
  },
}));

// This block ensures the state persists on page refresh
if (typeof window !== "undefined") {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username");
  const user_id = localStorage.getItem("user_id");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useBearStore.setState({ isLoggedIn, username, user_id, isAdmin });
}

export default useBearStore;
