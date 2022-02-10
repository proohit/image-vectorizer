import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import Image from "react-bootstrap/Image";

export default function Home() {
  const [image, setImage] =
    useState<{ contents: ArrayBuffer | string; type: string }>(null);
  const [resutlingSvg, setResultingSvg] = useState<string>("");

  const handleImageUpload: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("image", new Blob([image.contents], { type: image.type }));
    formData.set("type", image.type);
    const res = fetch("/api/image-to-vector", {
      method: "POST",
      body: formData,
    });
    res.then((r) => r.text()).then((svg) => setResultingSvg(svg));
  };

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      setImage({ contents: reader.result, type: file.type });
      console.log(reader.result);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Container>
      <Form>
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Control type="file" size="lg" onChange={handleImageChange} />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleImageUpload}>
          Upload
        </Button>
        {resutlingSvg && (
          <Image src={`data:image/svg+xml;utf8,${resutlingSvg}`} />
        )}
      </Form>
    </Container>
  );
}
