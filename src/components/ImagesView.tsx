import { Download } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { MouseEventHandler } from "react";
import { getSvgDataUrl } from "../utils/svg";
import { ArrowRight } from "./icons/ArrowRight";

type Props = {
  inputImageLoading: boolean;
  inputImage: ArrayBuffer;
  outputSvgLoading: boolean;
  outputSvg: string;
};

export const ImagesView: React.FC<Props> = ({
  inputImage,
  outputSvg: resutlingSvg,
  outputSvgLoading: svgLoading,
}) => {
  const downloadSvg: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const element = document.createElement("a");
    element.setAttribute("href", getSvgDataUrl(resutlingSvg));
    element.setAttribute("download", "result.svg");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  return (
    <Paper sx={{ p: 2, my: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Preview
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid
        spacing={2}
        container
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
      >
        <Grid item xs container justifyContent="center">
          {inputImage && (
            <img
              width="100%"
              src={URL.createObjectURL(new Blob([inputImage]))}
            />
          )}
        </Grid>
        <Grid item xs={1} container justifyContent="center">
          <ArrowRight />
        </Grid>
        <Grid item xs container justifyContent="center">
          {svgLoading ? (
            <CircularProgress />
          ) : (
            resutlingSvg && (
              <Grid container direction="column" spacing={1}>
                <Grid item xs container justifyContent="center">
                  <img width="100%" src={getSvgDataUrl(resutlingSvg)} />
                </Grid>
                <Grid item xs container justifyContent="center">
                  <Button
                    startIcon={<Download />}
                    variant="contained"
                    onClick={downloadSvg}
                  >
                    Download
                  </Button>
                </Grid>
              </Grid>
            )
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};
