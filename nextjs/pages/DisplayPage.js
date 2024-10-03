import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import MarketSection from "./MarketSection"; // We'll create this component next

const DisplayPage = () => {
  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "#ffffff",
      }}
    >
      <Typography
        variant="h2"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 'bold', // Makes the text bold
          textTransform: 'uppercase', // Makes the text uppercase
          marginButtom: '20px'
        }}
      >
        Financial Markets Dashboard
      </Typography>
      <Grid container spacing={4}>
        {/* S&P 500 Section */}
        <Grid item xs={12} md={6}>
          <MarketSection
            title="S&P 500 Index"
            apiEndpoint="/api/sp500"
            metrics={[
              { key: "stock_price", label: "Stock Price", unit: "$" },
              { key: "intrinsic_value", label: "Intrinsic Value", unit: "$" },
              { key: "margin_of_safety", label: "Margin of Safety", unit: "%" },
              { key: "rating", label: "Rating", unit: "" },
            ]}
          />
        </Grid>

        {/* Nasdaq 100 Section */}
        <Grid item xs={12} md={6}>
          <MarketSection
            title="Nasdaq 100 Index"
            apiEndpoint="/api/nasdaq100"
            metrics={[
              { key: "stock_price", label: "Stock Price", unit: "$" },
              { key: "intrinsic_value", label: "Intrinsic Value", unit: "$" },
              { key: "margin_of_safety", label: "Margin of Safety", unit: "%" },
              { key: "rating", label: "Rating", unit: "" },
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DisplayPage;
