import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import Container from "react-bootstrap/Container";
import { Introduction } from "../src/components/Introduction";
import Settings from "../src/types/Settings";
import { AppNavbar } from "../src/components/AppNavbar";
import { ImageForm } from "../src/components/ImageForm";
import { ImagesView } from "../src/components/ImagesView";
import SettingsForm from "../src/components/SettingsForm";
import { Alert } from "react-bootstrap";
import { notifications } from "../src/constants/notifications";

export default function Home() {
  const [image, setImage] = useState<{
    contents: ArrayBuffer;
    type: string;
  }>({ contents: null, type: null });
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [svgLoading, setSvgLoading] = useState<boolean>(false);
  const [resutlingSvg, setResultingSvg] = useState<string>("");

  const [settings, setSettings] = useState<Settings>({
    fillStrategy: "dominant",
    steps: undefined,
  });

  const [notification, setNotification] = useState<{
    message: string;
    severity: "danger" | "success" | "info" | "warning";
  }>(null);

  const handleImageUpload: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if (image.contents !== null) {
      setSvgLoading(true);
      setResultingSvg("");
      const formData = new FormData();
      formData.set("image", new Blob([image.contents], { type: image.type }));
      formData.set("options", JSON.stringify(settings));
      formData.set("type", image.type);
      try {
        const res = await fetch("/api/image-to-vector", {
          method: "POST",
          body: formData,
        });
        if (!res.ok || res.status < 200 || res.status >= 300) {
          throw new Error(await res.json());
        } else {
          const svg = await res.text();
          setResultingSvg(svg);
          setNotification({
            message: notifications.convertSuccessful,
            severity: "success",
          });
        }
      } catch (err) {
        setNotification({
          message: err.message,
          severity: "danger",
        });
      } finally {
        setSvgLoading(false);
      }
    }
  };

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setImageLoading(true);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage({ contents: reader.result as ArrayBuffer, type: file.type });
      setImageLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <AppNavbar />
      <Container className="my-4">
        <Introduction />
      </Container>
      <Container className="border p-3">
        <ImageForm
          onImageChange={handleImageChange}
          onImageUpload={handleImageUpload}
        />
        <SettingsForm settings={settings} onSettingsChange={setSettings} />
        <ImagesView
          inputImageLoading={imageLoading}
          inputImage={image.contents}
          outputSvgLoading={svgLoading}
          outputSvg={resutlingSvg}
        />
      </Container>
      {notification && (
        <Container className="mt-4 p-0">
          <Alert
            dismissible
            show={!!notification}
            variant={notification.severity}
            onClose={() => setNotification(null)}
          >
            <Alert.Heading>
              {notification.severity.toLocaleUpperCase()}
            </Alert.Heading>
            <p>{notification.message}</p>
          </Alert>
        </Container>
      )}
    </>
  );
}
