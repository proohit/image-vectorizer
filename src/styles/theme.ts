import { createTheme } from "@mui/material/styles";
import { blueGrey, red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: blueGrey[600],
    },
    secondary: {
      main: blueGrey[900],
    },
  },
});

export default theme;
