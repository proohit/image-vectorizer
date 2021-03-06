import { Chip, styled, Typography } from "@mui/material";

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
}));

export const Introduction: React.FC = () => {
  return (
    <>
      <Typography variant="h3" sx={{ margin: 4 }} align="center">
        Image Vectorizer
      </Typography>
      <Typography variant="h5" align="center">
        Transform JPG/JPEG/PNG/GIF images to SVG vector graphics
      </Typography>
      <Typography variant="h6">
        Usage:
        <ol>
          <li>
            Select an image by clicking on
            <StyledChip color="primary" label="Upload File" sx={{ mx: 1 }} />
            or by dragging and dropping an image file into the application.
          </li>
          <li>Adjust vectorization settings (coming soon)</li>
          <li>
            Transform the image by clicking on
            <StyledChip color="primary" label="Transform" sx={{ mx: 1 }} />
          </li>
        </ol>
      </Typography>
    </>
  );
};
