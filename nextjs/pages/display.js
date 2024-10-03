import React, { useEffect, useState, useMemo } from "react";
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

// Utility function to generate distinct colors
const generateColor = (index) => {
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#C9CBCF",
    "#8E5EA2",
    "#3CBA9F",
    "#E8C3B9",
    "#B3E5FC",
    "#FFC107",
    "#D32F2F",
  ];
  return colors[index % colors.length];
};

const DisplayPage = () => {
  const [sp500, setSp500] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("rating");
  const [sortDirection, setSortDirection] = useState("desc");

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

  // Sorting Function with useMemo for optimization
  const sortedSP500 = useMemo(() => {
    return [...filteredSP500].sort((a, b) => {
      const aValue = sortBy === "company" ? a.company : a.rating;
      const bValue = sortBy === "company" ? b.company : b.rating;

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredSP500, sortBy, sortDirection]);

  // Select Top 5 Companies by Rating
  const top5 = sortedSP500.slice(0, 5);

  // Define the metrics to display
  const metrics = [
    { key: "stock_price", label: "Stock Price", unit: "$" },
    { key: "intrinsic_value", label: "Intrinsic Value", unit: "$" },
    { key: "margin_of_safety", label: "Margin of Safety", unit: "%" },
    { key: "rating", label: "Rating", unit: "" },
    { key: "gross_profit_margin", label: "Gross Profit Margin", unit: "%" },
    { key: "return_on_equity", label: "Return on Equity", unit: "%" },
    { key: "roic", label: "ROIC", unit: "%" },
    { key: "sga_to_revenue", label: "SGA to Revenue", unit: "%" },
    { key: "debt_to_equity", label: "Debt to Equity", unit: "" },
    { key: "current_ratio", label: "Current Ratio", unit: "" },
    { key: "cash_ratio", label: "Cash Ratio", unit: "" },
    { key: "quick_ratio", label: "Quick Ratio", unit: "" },
    { key: "roa", label: "ROA", unit: "%" },
  ];

  // Prepare chart data with multiple metrics for top 5 companies
  const chartData = {
    labels: top5.map((item) => item.company), // X-axis labels (Company names)
    datasets: metrics.map((metric, index) => ({
      label: metric.label,
      data: top5.map((item) =>
        item[metric.key] !== null && item[metric.key] !== undefined
          ? item[metric.key]
          : 0
      ),
      borderColor: generateColor(index),
      backgroundColor: `${generateColor(index)}80`, // Adding transparency
      yAxisID: "y", // Assigning all to primary y-axis
      tension: 0.3, // Smooth curves
      pointRadius: 5, // Increase point size for better visibility
      pointHoverRadius: 7, // Increase point size on hover
    })),
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
          boxWidth: 12,
          padding: 15,
        },
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(index);

          // Toggle visibility
          meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
          ci.update();
        },
      },
      title: {
        display: true,
        text: "Top 5 S&P 500 Companies by Rating - Financial Metrics",
        color: "#ffffff",
        font: {
          size: 18,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            const metric = metrics[context.datasetIndex];
            let label = `${metric.label}: `;
            if (metric.unit === "$") {
              label += `$${context.parsed.y}`;
            } else if (metric.unit === "%") {
              label += `${context.parsed.y}%`;
            } else {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        ticks: {
          color: "#ffffff",
          callback: function (value) {
            return value;
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
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
          <CircularProgress sx={{ color: "#ffffff" }} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {/* Display the graph */}
          <Box sx={{ mb: 4 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>

          {/* Display the table */}
          <TableContainer component={Paper} sx={{ backgroundColor: "#1E1E1E" }}>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Company",
                    "Stock Price",
                    "Intrinsic Value",
                    "Margin of Safety",
                    "Rating",
                    "Gross Profit Margin",
                    "Return on Equity",
                    "ROIC",
                    "SGA to Revenue",
                    "Debt to Equity",
                    "Current Ratio",
                    "Cash Ratio",
                    "Quick Ratio",
                    "ROA",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: "#ffffff",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {top5.map((item, index) => (
                  <TableRow
                    key={item.company}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#333333",
                      },
                      backgroundColor:
                        index % 2 === 0 ? "#1E1E1E" : "#272727",
                    }}
                  >
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.company}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.stock_price !== null
                        ? `$${item.stock_price.toFixed(2)}`
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.intrinsic_value !== null
                        ? `$${item.intrinsic_value.toFixed(2)}`
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.margin_of_safety !== null
                        ? `${item.margin_of_safety.toFixed(2)}%`
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.rating !== null
                        ? item.rating.toFixed(2)
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.gross_profit_margin !== null
                        ? `${item.gross_profit_margin.toFixed(2)}%`
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.return_on_equity !== null
                        ? `${item.return_on_equity.toFixed(2)}%`
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.roic !== null
                        ? `${item.roic.toFixed(2)}%`
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.sga_to_revenue !== null
                        ? `${item.sga_to_revenue.toFixed(2)}%`
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.debt_to_equity !== null
                        ? item.debt_to_equity.toFixed(2)
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.current_ratio !== null
                        ? item.current_ratio.toFixed(2)
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.cash_ratio !== null
                        ? item.cash_ratio.toFixed(2)
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.quick_ratio !== null
                        ? item.quick_ratio.toFixed(2)
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.roa !== null
                        ? `${item.roa.toFixed(2)}%`
                        : "N/A"}
                    </TableCell>
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
