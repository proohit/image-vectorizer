import { Transform, Upload } from "@mui/icons-material";
import { Button, Paper, Stack, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, MouseEventHandler, useState } from "react";
import Settings from "../types/Settings";
import SettingsForm from "./SettingsForm";

const FileNameLabel = styled("span")(({ theme }) => ({
  padding: theme.spacing(0, 1),
}));

type Props = {
  onImageChange: (file: File) => void;
  onImageUpload: MouseEventHandler<HTMLButtonElement>;
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
};

export const ImageForm: React.FC<Props> = ({
  onImageChange,
  onImageUpload,
  onSettingsChange,
  settings,
}) => {
  const [fileName, setFileName] = useState<string>("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    onImageChange(file);
    setFileName(file.name);
  };

  const handleImageDrop = (ev) => {
    ev.preventDefault();
    const files = ev.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      onImageChange(file);
      setFileName(file.name);
    }
  };

  return (
    <Paper sx={{ p: 2, my: 2 }}>
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="column"
        gap={2}
      >
        <Box
          sx={{
            border: 1,
            width: 1,
            textAlign: "center",
            p: 2,
            borderStyle: "dashed",
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleImageDrop}
        >
          <Button
            startIcon={fileName ? null : <Upload />}
            variant="contained"
            component="label"
          >
            {fileName ? (
              <FileNameLabel>{fileName}</FileNameLabel>
            ) : (
              "Upload File"
            )}
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          <Typography display="inline" sx={{ ml: 1 }}>
            ... or drag and drop an image here
          </Typography>
        </Box>
        <SettingsForm onSettingsChange={onSettingsChange} settings={settings} />
        <Button
          startIcon={<Transform />}
          variant="contained"
          onClick={onImageUpload}
        >
          Transform
        </Button>
      </Stack>
    </Paper>
  );
};
