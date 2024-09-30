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

const DisplayPage = () => {
  const [sp500, setSp500] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("company"); // Default sorting by company name
  const [sortDirection, setSortDirection] = useState("asc"); // Default sorting direction

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
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Sort By Options */}
          <Button
            variant="outlined"
            onClick={() => {
              setSortBy("company");
              setSortDirection("asc");
            }}
            sx={{
              borderRadius: '8px',
              borderColor: sortBy === "company" ? "#0095ff" : "#333",
              backgroundColor: sortBy === "company" ? "#0095ff" : "transparent",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#0095ff",
              },
              marginRight: '8px',
            }}
          >
            Sort by Company
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setSortBy("rating");
              setSortDirection("asc");
            }}
            sx={{
              borderRadius: '8px',
              borderColor: sortBy === "rating" ? "#0095ff" : "#333",
              backgroundColor: sortBy === "rating" ? "#0095ff" : "transparent",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#0095ff",
              },
              marginRight: '8px',
            }}
          >
            Sort by Rating
          </Button>

          {/* Sort Direction Arrow Button */}
          <Button
            variant="outlined"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            sx={{
              borderRadius: '8px',
              borderColor: "#333",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#333",
              },
              padding: '0 8px',
            }}
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </Button>
        </Box>

        <TextField
          label="Search by Company Name"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: '250px',
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
            style: { color: "#ffffff" },
          }}
        />
      </Box>

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh' // Adjust as needed
          }}
        >
          <img 
            src="/VIS_Background.png" // Ensure correct path
            alt="Loading"
            style={{ width: '30%', height: 'auto', marginBottom: '20px' }} // Adjust size as needed
          />
          <CircularProgress sx={{ color: "#ffffff" }} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: "#1E1E1E" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Company</TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Stock Price</TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Intrinsic Value</TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Margin of Safety</TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Rating</TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Gross Profit Margin</TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Return on Equity</TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>ROIC</TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>SGA to Revenue</TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Debt to Equity</TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Current Ratio</TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Cash Ratio</TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>Quick Ratio</TableCell>
                <TableCell sx={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "bold" }}>ROA</TableCell>
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
                    backgroundColor: index % 2 === 0 ? "#1E1E1E" : "#272727"
                  }}
                >
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.company}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.stock_price !== null ? item.stock_price.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.intrinsic_value !== null ? item.intrinsic_value.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.margin_of_safety !== null ? item.margin_of_safety.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.rating !== null ? item.rating.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.gross_profit_margin !== null ? item.gross_profit_margin.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.return_on_equity !== null ? item.return_on_equity.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.roic !== null ? item.roic.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.sga_to_revenue !== null ? item.sga_to_revenue.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.debt_to_equity !== null ? item.debt_to_equity.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.current_ratio !== null ? item.current_ratio.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.cash_ratio !== null ? item.cash_ratio.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.quick_ratio !== null ? item.quick_ratio.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>{item.roa !== null ? item.roa.toFixed(2) : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default DisplayPage;
