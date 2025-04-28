import React from "react";
import { createTheme, ThemeProvider, Tooltip } from "@mui/material";

const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          border: "4px solid #ffff",
          opacity: 10,
          borderRadius: "12px",
          backgroundColor: "#1e293b",
          color: "white",
          fontSize: "14px",
          padding: "8px",
          paddingLeft: "10px",
          paddingRight: "10px",
        },
        arrow: {
          color: "#1e293b",
        },
      },
    },
  },
});

function TooltipCustom({ title, children }) {
  return (
    <ThemeProvider theme={theme}>
      <Tooltip title={title} arrow>
        {children}
      </Tooltip>
    </ThemeProvider>
  );
}

export default TooltipCustom;
