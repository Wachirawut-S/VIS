import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DisplayPage = () => {
  const [sp500, setSp500] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("company");
  const [sortDirection, setSortDirection] = useState("asc");

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
        setLoading(false);
      }
    };

    fetchSP500();
  }, []);

  // Filter SP500 components based on search query
  const filteredSP500 = sp500.filter((item) =>
    item.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting Function
  const sortedSP500 = [...filteredSP500].sort((a, b) => {
    const aValue = sortBy === "company" ? a.company : a.rating;
    const bValue = sortBy === "company" ? b.company : b.rating;

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Prepare chart data
  const chartData = {
    labels: sortedSP500.map((item) => item.company), // X-axis labels (Company names)
    datasets: [
      {
        label: "Stock Price",
        data: sortedSP500.map((item) => item.stock_price), // Y-axis data (Stock prices)
        borderColor: "#0095ff",
        backgroundColor: "rgba(0, 149, 255, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "#ffffff",
      }}
    >
      <Typography variant="h4" gutterBottom>
        S&P500 Index
      </Typography>

      {/* Sort Options and Search Bar */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        {/* Existing sort buttons and search bar here */}
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh", // Adjust as needed
          }}
        >
          <CircularProgress sx={{ color: "#ffffff" }} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {/* Display the graph */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Stock Prices of S&P 500 Companies
            </Typography>
            <Line data={chartData} />
          </Box>

          {/* Display the table */}
          <TableContainer component={Paper} sx={{ backgroundColor: "#1E1E1E" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Company</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Stock Price</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Intrinsic Value</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Margin of Safety</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Rating</TableCell>
                  {/* Add other columns as necessary */}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedSP500.map((item, index) => (
                  <TableRow
                    key={item.company}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#333333",
                      },
                      backgroundColor: index % 2 === 0 ? "#1E1E1E" : "#272727",
                    }}
                  >
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.company}</TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.stock_price !== null ? item.stock_price.toFixed(2) : "N/A"}</TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.intrinsic_value !== null ? item.intrinsic_value.toFixed(2) : "N/A"}</TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.margin_of_safety !== null ? item.margin_of_safety.toFixed(2) : "N/A"}</TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.rating !== null ? item.rating.toFixed(2) : "N/A"}</TableCell>
                    {/* Add other columns as necessary */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default DisplayPage;
