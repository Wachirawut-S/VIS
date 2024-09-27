import * as React from "react";
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from "@mui/material"; 
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

//material UI
import FunctionsIcon from "@mui/icons-material/Functions";
import PersonIcon from "@mui/icons-material/Person";
import useBearStore from "@/store/useBearStore";
import ListIcon from '@mui/icons-material/List';

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const appName = useBearStore((state) => state.appName); 
  const isLoggedIn = useBearStore((state) => state.isLoggedIn);
  const username = useBearStore((state) => state.username);
  const isAdmin = useBearStore((state) => state.isAdmin); 
  const logout = useBearStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#242323" }}>
        <Toolbar>
        <Link href="/" passHref>
        <Box component="span" sx={{ width: "20px" }} />
            <Image 
              src="/VIS.png"  
              alt="App Logo"
              width={40}        
              height={40}       
              style={{ cursor: "pointer" }}

            />
          </Link>
          <Box component="span" sx={{ width: "20px" }} />
          <Typography
            variant="body1"
            sx={{ fontSize: "22px", fontWeight: 500, color: "#ffffff", padding: "0 10px", fontFamily: "Prompt" }}
          >
            
            {appName}
          </Typography>

          <Link href="/display" passHref>
                <Button
                  sx={{
                    color: "#ffffff",
                    textTransform: "capitalize",
                    transition: "0.3s",
                    "&:hover": {
                      backgroundColor: "#333333", // Change to grey when hovered
                      color: "#ffffff",
                    },
                  }}
                >
                  <ListIcon sx={{ marginRight: "5px" }} /> Display
                </Button>
              </Link>

          <Box sx={{ flexGrow: 1 }} />
          {!isLoggedIn ? (
            <>
              <Link href="/register" passHref>
                <Button
                  sx={{
                    color: "#ffffff",
                    textTransform: "capitalize",
                    transition: "0.3s",
                    border: "1px solid #cccccc", // Add border when not hovered
                    "&:hover": {
                      backgroundColor: "#333333", // Change to grey when hovered
                      color: "#ffffff",
                      border: "none", // Remove border when hovered
                    },
                  }}
                >
                  <PersonIcon sx={{ marginRight: "5px" }} /> Register
                </Button>
              </Link>

              <Box component="span" sx={{ width: "10px" }} />
              
              <Link href="/login" passHref>
                <Button
                  sx={{
                    color: "#ffffff",
                    textTransform: "capitalize",
                    transition: "0.3s",
                    border: "1px solid #cccccc", // Add border when not hovered
                    "&:hover": {
                      backgroundColor: "#333333", // Change to grey when hovered
                      color: "#ffffff",
                      border: "none", // Remove border when hovered
                    },
                  }}
                >
                  Login
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Avatar sx={{ marginRight: 1 }}>{username.charAt(0)}</Avatar> 
              <Typography sx={{ color: "#ffffff", padding: "0 10px", fontStyle: "italic" }}>
                {isAdmin ? `Welcome Admin, ${username}` : `Welcome, ${username}`}
              </Typography>

              <Box component="span" sx={{ width: "10px" }} />

              <Button
                sx={{
                  color: "#ffffff",
                  textTransform: "capitalize",
                  transition: "0.3s",
                  border: "1px solid #cccccc", // Add border when not hovered
                  "&:hover": {
                    backgroundColor: "#333333", // Change to grey when hovered
                    color: "#ffffff",
                    border: "none", // Remove border when hovered
                  },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
};

const NavigationLink = ({ href, label }) => (
  <Link href={href} passHref>
    <Typography
      variant="body1"
      sx={{
        fontSize: "14px",
        fontWeight: 500,
        color: "#ffffff",
        padding: "0 10px",
        cursor: "pointer",
      }}
    >
      {label}
    </Typography>
  </Link>
);

export default NavigationLayout;
