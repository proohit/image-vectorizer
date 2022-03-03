import { GitHub } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

export const AppNavbar: React.FC = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Image Vectorizer
        </Typography>
        <IconButton
          sx={(theme) => ({
            color: theme.palette.primary.contrastText,
          })}
          href="https://github.com/proohit/image-vectorizer"
          target="_blank"
        >
          <GitHub />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
