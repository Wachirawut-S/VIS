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
  CircularProgress,
  Alert,
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
import PropTypes from 'prop-types';

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
  ];
  return colors[index % colors.length];
};

const MarketSection = ({ title, apiEndpoint, metrics = [] }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc"); // Default to descending sort

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${title} data`);
        }
        const fetchedData = await response.json();
        console.log('Fetched Data:', fetchedData);

        // Adjust based on actual API response structure
        const dataArray = Array.isArray(fetchedData) ? fetchedData : fetchedData.data;
        if (!Array.isArray(dataArray)) {
          throw new Error(`Invalid data format for ${title}`);
        }

        setData(dataArray);
      } catch (err) {
        console.error(`Error fetching ${title} data:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint, title]);

  // Sorting Function - Sort only by ratings
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a.rating;
      const bValue = b.rating;

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue; // Descending sort by default
    });
  }, [data, sortDirection]);

  // Select Top 5 Companies based on sorted data
  const top5 = sortedData.slice(0, 5);

  // Prepare chart data
  const chartData = useMemo(() => {
    return {
      labels: top5.map((item) => item.company || 'N/A'), // X-axis labels (Company names)
      datasets: metrics.map((metric, index) => ({
        label: metric.label,
        data: top5.map((item) =>
          item[metric.key] !== null && item[metric.key] !== undefined
            ? item[metric.key]
            : 0
        ),
        borderColor: generateColor(index),
        backgroundColor: `${generateColor(index)}80`, // Adding transparency
        yAxisID: "y",
        tension: 0.3, // Smooth curves
        pointRadius: 5, // Increase point size for better visibility
        pointHoverRadius: 7, // Increase point size on hover
      })),
    };
  }, [top5, metrics]);

  // Chart options
  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#ffffff",
            boxWidth: 12,
            padding: 15,
          },
        },
        title: {
          display: true,
          text: `${title} - Top 5 Companies Financial Metrics`,
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
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    };
  }, [metrics, title]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center"
        sx={{
          textTransform: 'uppercase', // Makes the text uppercase
        }}
      >
        {title}
      </Typography>

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
            style={{ width: '15%', height: 'auto', marginBottom: '20px' }} // Adjust size as needed
          />
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
                  <TableCell
                    sx={{
                      color: "#ffffff",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                  >
                    Company
                  </TableCell>
                  {Array.isArray(metrics) && metrics.map((metric) => (
                    <TableCell
                      key={metric.label}
                      sx={{
                        color: "#ffffff",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                      }}
                    >
                      {metric.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(top5) && top5.map((item, index) => (
                  <TableRow
                    key={item.company || index}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#333333",
                      },
                      backgroundColor:
                        index % 2 === 0 ? "#1E1E1E" : "#272727",
                    }}
                  >
                    <TableCell sx={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      {item.company || 'N/A'} {/* Display the company name here */}
                    </TableCell>
                    {Array.isArray(metrics) && metrics.map((metric) => (
                      <TableCell
                        key={metric.key}
                        sx={{ color: "#ffffff", fontSize: "0.85rem" }}
                      >
                        {item[metric.key] !== null && item[metric.key] !== undefined
                          ? metric.unit
                            ? `${metric.unit} ${typeof item[metric.key] === "number" ? item[metric.key].toFixed(2) : item[metric.key]}`
                            : `${typeof item[metric.key] === "number" ? item[metric.key].toFixed(2) : item[metric.key]}`
                          : "N/A"}
                      </TableCell>
                    ))}
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

MarketSection.propTypes = {
  title: PropTypes.string.isRequired,
  apiEndpoint: PropTypes.string.isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      unit: PropTypes.string,
    })
  ).isRequired,
};

export default MarketSection;
