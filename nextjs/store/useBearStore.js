import { create } from "zustand";

const useBearStore = create((set) => ({
  appName: undefined, // Set the default app name to "VIS"
  isLoggedIn: false,
  username: null,
  isAdmin: false,
  setAppName: (newAppName) => set({ appName: newAppName }),
  setLogin: (username, isAdmin) => {
    set({ isLoggedIn: true, username, isAdmin });
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("username", username);
    localStorage.setItem("isAdmin", isAdmin.toString());
  },
  logout: () => {
    set({ isLoggedIn: false, username: null, isAdmin: false });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
  },
}));

// This block ensures the state persists on page refresh
if (typeof window !== "undefined") {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useBearStore.setState({ isLoggedIn, username, isAdmin });
}

export default useBearStore;
