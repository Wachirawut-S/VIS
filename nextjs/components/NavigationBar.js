import * as React from "react";
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from "@mui/material"; 
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import PersonIcon from "@mui/icons-material/Person";
import ListIcon from '@mui/icons-material/List';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';
import PeopleIcon from '@mui/icons-material/People';
import useBearStore from "@/store/useBearStore";

const NavigationLayout = ({ children }) => {
  const router = useRouter();
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
              width={60}        
              height={60}       
              style={{ cursor: "pointer" }}
            />
          </Link>

          <Typography
            variant="body1"
            sx={{ fontSize: "22px", fontWeight: 500, color: "#ffffff", padding: "0 10px", fontFamily: "Montserrat" }}
          >
          </Typography>

          <Link href="/DisplayPage" passHref>
            <Button
              sx={{
                color: "#ffffff",
                border: "1px solid #707070",
                textTransform: "capitalize",
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#333333",
                  color: "#ffffff",
                },
              }}
            >
              <ListIcon sx={{ marginRight: "5px" }} /> Display
            </Button>
          </Link>
          <Box component="span" sx={{ width: "10px" }} />
          <Link href="/S&P500" passHref>
            <Button
              sx={{
                color: "#ffffff",
                border: "1px solid #707070",
                textTransform: "capitalize",
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#333333",
                  color: "#ffffff",
                },
              }}
            ><TrendingUpIcon sx={{ marginRight: "5px" }}/> S&P500
            </Button>
          </Link>
          <Box component="span" sx={{ width: "10px" }} />
          <Link href="/Nasdaq100" passHref>
            <Button
              sx={{
                color: "#ffffff",
                textTransform: "capitalize",
                border: "1px solid #707070",
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#333333",
                  color: "#ffffff",
                },
              }}
            ><TrendingUpIcon sx={{ marginRight: "5px" }}/> Nasdaq100
            </Button>
          </Link>
          <Box component="span" sx={{ width: "10px" }} />
          <Link href="/Calculator" passHref>
            <Button
              sx={{
                color: "#ffffff",
                textTransform: "capitalize",
                border: "1px solid #707070",
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#333333",
                  color: "#ffffff",
                },
              }}
            ><CalculateIcon sx={{ marginRight: "5px" }}/> Calculator
            </Button>
          </Link>
          <Box component="span" sx={{ width: "10px" }} />
          <Link href="/Forum" passHref>
            <Button
              sx={{
                color: "#ffffff",
                textTransform: "capitalize",
                border: "1px solid #707070",
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#333333",
                  color: "#ffffff",
                },
              }}
            ><PeopleIcon sx={{ marginRight: "5px" }}/> Community
            </Button>
          </Link>
          <Box component="span" sx={{ width: "10px" }} />
          <Link href="/aboutus" passHref>
            <Button
              sx={{
                color: "#ffffff",
                textTransform: "capitalize",
                border: "1px solid #707070",
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#333333",
                  color: "#ffffff",
                },
              }}
            ><PeopleIcon sx={{ marginRight: "5px" }}/> About
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
                    border: "1px solid #707070",
                    "&:hover": {
                      backgroundColor: "#333333",
                      color: "#ffffff",
                      border: "none",
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
                    border: "1px solid #707070",
                    "&:hover": {
                      backgroundColor: "#333333",
                      color: "#ffffff",
                      border: "none",
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

              {isAdmin && (
                <Link href="/admin/users" passHref>
                  <Button
                    sx={{
                      color: "#ffffff",
                      textTransform: "capitalize",
                      transition: "0.3s",
                      border: "1px solid #707070",
                      "&:hover": {
                        backgroundColor: "#333333",
                        color: "#ffffff",
                        border: "none",
                      },
                    }}
                  >
                    <SettingsIcon sx={{ marginRight: "5px" }} /> 
                    Manage Users
                  </Button>
                </Link>
              )}

              <Box component="span" sx={{ width: "10px" }} />

              <Button
                sx={{
                  color: "#ffffff",
                  textTransform: "capitalize",
                  transition: "0.3s",
                  border: "1px solid #707070",
                  "&:hover": {
                    backgroundColor: "#333333",
                    color: "#ffffff",
                    border: "none",
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

export default NavigationLayout;
