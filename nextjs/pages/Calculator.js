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
  Button,
  Typography,
  Box,
  TextField,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from "@mui/material";
import axios from "axios";

import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import Divider from "@mui/material/Divider";

const Calculator = () => {
  const router = useRouter(); // Use useRouter for redirection
  const isLoggedIn = useBearStore((state) => state.isLoggedIn);
  const username = useBearStore((state) => state.username);
  const user_id = useBearStore((state) => state.user_id);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [calculationToDelete, setCalculationToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // Handle opening the delete confirmation dialog
  const handleDeleteOpen = (calculationId) => {
    setCalculationToDelete(calculationId);
    console.log(`setCalculationToDelete with ID: ${calculationId}`);
    setOpenDeleteDialog(true);
  };

  // Handle closing the delete confirmation dialog
  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    console.log(`setCalculationToDelete false`);
    setCalculationToDelete(null);
    setDeleteError("");
  };

  // Handle delete confirmation and removal
  const handleDeleteConfirm = async () => {
    console.log("Delete confirm clicked"); // Add this log to check if the function is called
    if (!calculationToDelete) {
      console.error("No calculation to delete");
      return;
    }
  
    console.log(`Deleting calculation with ID: ${calculationToDelete}`);
    
    try {
      const response = await fetch(`/api/calculation/${calculationToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        console.log("Delete request successful");
        setHistory(prevHistory => prevHistory.filter((record) => record.id !== calculationToDelete));
        handleDeleteClose();
        fetchHistory();
      } else {
        const errorData = await response.json();
        setDeleteError(errorData.detail || "Failed to delete calculation");
        console.error("Failed to delete calculation:", errorData);
      }
    } catch (error) {
      console.error("Error deleting calculation:", error);
      setDeleteError("An error occurred while deleting the calculation.");
    }
  };

  const [history, setHistory] = useState([]);
  const [inputs, setInputs] = useState({
    company_name: "",
    stock_price: "",
    earnings_per_share: "",
    growth_rate: "",
    revenue: "",
    cost_of_goods_sold: "",
    net_income: "",
    share_holder_equity: "",
    sga_and_a: "",
    total_debt: "",
    current_asset: "",
    current_liability: "",
    cash_and_cash_equivalents: "",
    quick_ratio: "",
    roa: "",
  });

  const [result, setResult] = useState({
    rating: null,
    intrinsic_value: null,
    margin_of_safety: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "company_name", direction: "asc" });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchHistory(); // Fetch history when the component loads
    }
  }, [isLoggedIn, router]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`/api/calculation/${user_id}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedHistory = [...history].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  const filteredHistory = sortedHistory.filter((record) =>
    record.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAndSubmit = async () => {

    try {
      
        // Extract values and convert to numbers
        const data = {
            user_id: user_id,
            username: username,
            company_name: inputs.company_name,
            stock_price: parseFloat(inputs.stock_price),
            // Initialize variables for calculations
            gross_profit_margin: 0,
            return_on_equity: 0,
            roic: 0,
            sga_to_revenue: 0,
            debt_to_equity: 0,
            current_ratio: 0,
            cash_ratio: 0,
            quick_ratio: parseFloat(inputs.quick_ratio),
            roa: parseFloat(inputs.roa),
        };

        // Perform calculations based on the provided method
        const revenue = parseFloat(inputs.revenue);
        const cost_of_goods_sold = parseFloat(inputs.cost_of_goods_sold);
        const net_income = parseFloat(inputs.net_income);
        const share_holder_equity = parseFloat(inputs.share_holder_equity);
        const total_debt = parseFloat(inputs.total_debt);
        const current_asset = parseFloat(inputs.current_asset);
        const current_liability = parseFloat(inputs.current_liability);
        const cash_and_cash_equivalents = parseFloat(inputs.cash_and_cash_equivalents);

        // Gross Profit Margin
        if (revenue) {
            data.gross_profit_margin = (revenue - cost_of_goods_sold) / revenue;
        }

        // Return on Equity
        if (share_holder_equity) {
            data.return_on_equity = net_income / share_holder_equity;
        }

        // ROIC calculation
        if (share_holder_equity) {
            data.roic = (net_income / share_holder_equity) * 100;
        }

        // SG&A to Revenue
        if (revenue) {
            data.sga_to_revenue = parseFloat(inputs.sga_and_a) / revenue;
        }

        // Debt Level
        if (share_holder_equity) {
            data.debt_to_equity = total_debt / share_holder_equity;
        }

        // Current Ratio
        if (current_liability) {
            data.current_ratio = current_asset / current_liability;
        }

        // Cash Ratio
        if (current_liability) {
            data.cash_ratio = cash_and_cash_equivalents / current_liability;
        }

        // Perform additional calculations (rating, intrinsic value, margin of safety)
        const intrinsic_value =
            inputs.earnings_per_share * (8.5 + 2 * parseFloat(inputs.growth_rate)) * 4.4 / 4.6;
        const margin_of_safety =
            (intrinsic_value - data.stock_price) / intrinsic_value;
        
        // Final rating
        let a = 0, b = 0, c = 0;

        // Rating calculation logic
        if (data.gross_profit_margin > 0.4) a++;
        if (data.return_on_equity > 0.2) a++;
        if (data.roic > 30) a++;
        if (data.sga_to_revenue < 0.3) a++;

        if (data.debt_to_equity < 0.8) b++;
        if (data.current_ratio > 1.5) c++;
        if (data.cash_ratio > 1) c++;
        if (data.quick_ratio > 1) c++;

        if (c === 3) b += 1;
        else if (c === 2) b += 0.5;
        else if (c === 1) b += 0.25;

        if (data.roa > 0.1) b++;

        const x = (a + b) / 8;

        const rating = ((margin_of_safety >= 0.4 ? 1 : margin_of_safety / 0.4) * 0.5) + (x * 0.5);

        // Update the data object with calculated values
        await axios.post("/api/calculation/create", {
            ...data,
            intrinsic_value: intrinsic_value.toFixed(2),
            margin_of_safety: margin_of_safety.toFixed(2),
            rating: rating.toFixed(2),
        });

        fetchHistory(); // Refresh the history after submission
    } catch (error) {
        console.error("Error calculating and submitting", error);
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#000", minHeight: "100vh", color: "#ffffff" }}>
      <Typography variant="h2" gutterBottom>
      <strong>FINANCIAL CALCULATOR </strong>
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, backgroundColor: "#111", padding: 3, borderRadius: "8px" }}>
        {/* Company Name Field */}
        <TextField
          name="company_name"
          label="Company Name"
          value={inputs.company_name}
          onChange={handleInputChange}
          fullWidth
          sx={{ gridColumn: "span 1", backgroundColor: "#222", color: "#ffffff" }}
          InputLabelProps={{ style: { color: "#ffffff" } }}
          InputProps={{ style: { color: "#ffffff" } }}
        />
        {/* Other Input Fields */}
        {Object.keys(inputs).map((key) =>
          key !== "company_name" ? (
            <TextField
              key={key}
              name={key}
              label={key.replace(/_/g, " ").toUpperCase()}
              value={inputs[key]}
              onChange={handleInputChange}
              fullWidth
              sx={{ backgroundColor: "#222", color: "#ffffff" }}
              InputLabelProps={{ style: { color: "#ffffff" } }}
              InputProps={{ style: { color: "#ffffff" } }}
            />
          ) : null
        )}
      </Box>

      <Button variant="contained" color="primary" onClick={calculateAndSubmit} sx={{ marginTop: 4  }}>
        Calculate
      </Button>

      <Divider sx={{ backgroundColor: "#ffffff", marginBottom: 2, marginTop:5 }} /> 

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2, marginBottom: 2 }}>
        <Typography variant="h4" >
        <strong>Calculation History</strong>
        </Typography>

        {/* Search Bar */}
        <TextField
          label="Search Company"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ backgroundColor: "#222", color: "#ffffff", width: '20%' , borderRadius: '10px'}}
          InputLabelProps={{ style: { color: "#ffffff" } }}
          InputProps={{ style: { color: "#ffffff" } }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: "#111" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#ffffff" }}>
                <TableSortLabel
                    active={sortConfig.key === "company_name"}
                    direction={sortConfig.direction}
                    onClick={() => handleSort("company_name")}
                    sx={{
                      color: sortConfig.key === "company_name" ? "#0095FF" : "#ffffff",
                      "&:hover": {
                        color: "#41e083",
                      },
                      "&.Mui-active": {
                        color: "#0095FF",
                      },
                      "& .MuiTableSortLabel-icon": {
                        color: "#0095FF !important", 
                      },
                    }}
                  >
                    Company
                  </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "#ffffff" }}>
              <TableSortLabel
                  active={sortConfig.key === "rating"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("rating")}
                  sx={{
                    color: sortConfig.key === "rating" ? "#0095FF" : "#ffffff",
                    "&:hover": {
                      color: "#41e083",
                    },
                    "&.Mui-active": {
                      color: "#0095FF",
                    },
                    "& .MuiTableSortLabel-icon": {
                      color: "#0095FF !important", 
                    },
                  }}
                >
                  Rating
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Stock Price</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Intrinsic Value</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Margin of Safety</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Gross Profit Margin</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Return on Equity</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>ROIC</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>SGA to Revenue</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Debt to Equity</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Current Ratio</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Cash Ratio</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Quick Ratio</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>ROA</TableCell>
              <TableCell sx={{ color: "#fe0004" }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHistory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={14} sx={{ color: "#ffffff", textAlign: "center" }}>
                No History Records
              </TableCell>
            </TableRow>
        ) : (
            filteredHistory.map((record, index) => (
              <TableRow key={index}>
                <TableCell sx={{ color: "#ffffff" }}>{record.company_name}</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{record.rating}</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{record.stock_price}</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{record.intrinsic_value}</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{record.margin_of_safety}</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{record.gross_profit_margin}</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{record.return_on_equity}</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{record.roic}</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{record.sga_to_revenue}</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{record.debt_to_equity}</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{record.current_ratio}</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{record.cash_ratio}</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{record.quick_ratio}</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>{record.roa}</TableCell>
                <TableCell>
                  <DeleteIcon
                    onClick={() => handleDeleteOpen(record.history_id)}
                    sx={{ color: "#fe0004", cursor: "pointer" }}
                  />
                </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

       {/* Delete Confirmation Dialog */}
       <Dialog open={openDeleteDialog} onClose={handleDeleteClose}>
        <DialogTitle sx={{ color: "#ffffff", backgroundColor: "#fe0004" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <WarningIcon sx={{ color: "#ffffff", marginRight: 1 }} />
            Confirm Delete Calculation
          </Box>
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#333", color: "#ffffff" }}>
          <Typography>
            Are you sure you want to delete this calculation? <br />
            This action will delete the calculation permanently and cannot be undone.
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#333" }}>
          <Button onClick={handleDeleteClose} sx={{ color: "#ffffff", backgroundColor: "#000" }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} sx={{ color: "#ffffff", backgroundColor: "#fe0004" }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calculator;
