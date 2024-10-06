import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; 
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
  Button,
  Typography,
  Container,
  Box,
  TextField,
} from "@mui/material";

const Calculator = () => {
  const router = useRouter(); // Use useRouter for redirection
  const isLoggedIn = useBearStore((state) => state.isLoggedIn);
  const username = useBearStore((state) => state.username);
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } 
  }, [isLoggedIn, router]);


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
        Calculator Page {username}
      </Typography>

    </Box>
  );
};

export default Calculator;
