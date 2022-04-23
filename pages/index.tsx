import { Upload } from "@mui/icons-material";
import {
  Alert,
  AlertProps,
  Box,
  Container,
  styled,
  Typography,
} from "@mui/material";
import { MouseEventHandler, useState } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { AppNavbar } from "../src/components/AppNavbar";
import { ImageForm } from "../src/components/ImageForm";
import { ImagesView } from "../src/components/ImagesView";
import { Introduction } from "../src/components/Introduction";
import { notifications } from "../src/constants/notifications";
import { uploadImage } from "../src/services/ApiService";
import Settings from "../src/types/Settings";

const DropIndicator = styled("div")({
  zIndex: 100,
  alignItems: "center",
  display: "flex",
  position: "fixed",
  top: "50%",
  right: "50%",
  transform: "translateX(50%)",
});

export default function Home() {
  const [image, setImage] = useState<{
    contents: ArrayBuffer;
    type: string;
  }>({ contents: null, type: null });
  const [{ dragging }, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop(item: { files: File[] }) {
      const file = item.files[0];
      setFileName(file.name);
      handleImageChange(file);
    },
    canDrop() {
      return true;
    },
    collect: (monitor: DropTargetMonitor) => ({
      dragging: monitor.isOver() && monitor.canDrop(),
    }),
  }));

  const [fileName, setFileName] = useState("");
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [svgLoading, setSvgLoading] = useState<boolean>(false);
  const [resutlingSvg, setResultingSvg] = useState<string>("");

  const [settings, setSettings] = useState<Settings>({
    fillStrategy: "dominant",
    colorized: true,
    steps: undefined,
    background: undefined,
    blackOnWhite: undefined,
    color: undefined,
    turnPolicy: undefined,
    threshold: undefined,
  });

  const [notification, setNotification] = useState<{
    message: string;
    severity: AlertProps["severity"];
  }>(null);

  const handleImageUpload: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if (image.contents !== null) {
      setSvgLoading(true);
      setResultingSvg("");
      try {
        const svg = await uploadImage(image.contents, image.type, settings);
        setResultingSvg(svg);
        setNotification({
          message: notifications.convertSuccessful,
          severity: "success",
        });
      } catch (err) {
        setNotification({
          message: err.message,
          severity: "error",
        });
      } finally {
        setSvgLoading(false);
      }
    }
  };

  const handleImageChange = (file: File) => {
    setImageLoading(true);
    setResultingSvg("");
    const reader = new FileReader();
    reader.onload = () => {
      setImage({ contents: reader.result as ArrayBuffer, type: file.type });
      setImageLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      {dragging && (
        <DropIndicator>
          <Upload sx={{ fontSize: 56, marginRight: 4 }} />
          <Typography sx={{ fontSize: 56 }} display="inline">
            Drop Image
          </Typography>
        </DropIndicator>
      )}
      <Box
        ref={drop}
        sx={
          dragging
            ? {
                filter: "blur(2px)",
              }
            : undefined
        }
      >
        <AppNavbar />
        <Container>
          <Introduction />
        </Container>
        <Container sx={{ mb: 2 }}>
          <ImageForm
            onImageChange={handleImageChange}
            onImageUpload={handleImageUpload}
            fileName={fileName}
            settings={settings}
            onSettingsChange={setSettings}
          />
          {notification && (
            <Alert
              severity={notification.severity}
              onClose={() => setNotification(null)}
            >
              {notification.message}
            </Alert>
          )}
          <ImagesView
            inputImageLoading={imageLoading}
            inputImage={image.contents}
            outputSvgLoading={svgLoading}
            outputSvg={resutlingSvg}
          />
        </Container>
      </Box>
    </>
  );
}
