import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
import Accordion from "react-bootstrap/Accordion";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const getSvgDataUrl = (svg: string) => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export default function Home() {
  const [image, setImage] = useState<{
    contents: ArrayBuffer;
    type: string;
  }>({ contents: null, type: null });
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [svgLoading, setSvgLoading] = useState<boolean>(false);
  const [resutlingSvg, setResultingSvg] = useState<string>("");

  const [settings, setSettings] = useState<{
    fillStrategy?: string;
    steps?: number;
  }>({ fillStrategy: "dominant", steps: undefined });

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
        const svg = await res.text();
        setResultingSvg(svg);
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
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#">Image Vectorizer</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                target="_blank"
                href="https://github.com/proohit/image-vectorizer"
              >
                <GitHub />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="my-4">
        <h1 className="text-center">Image Vectorizer</h1>
        <h3 className="text-center">
          Transform JPG/JPEG/PNG/GIF images to SVG vector graphics
        </h3>
        <h4>
          Usage:
          <ol>
            <li>
              Select an image by clicking on
              <span className="badge bg-secondary mx-2">Choose File</span>
            </li>
            <li>Adjust vectorization settings (coming soon)</li>
            <li>
              Upload the image by clicking on
              <span className="badge bg-primary mx-2">Upload</span>
            </li>
          </ol>
        </h4>
      </Container>
      <Container className="border">
        <Form className="p-3">
          <Row>
            <Col xs="6" md="10">
              <Form.Control type="file" onChange={handleImageChange} />
            </Col>
            <Col xs="6" md="2" className="text-center">
              <Button
                variant="primary"
                type="submit"
                onClick={handleImageUpload}
              >
                Upload
              </Button>
            </Col>
          </Row>
          <Accordion className="mt-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Settings</Accordion.Header>
              <Accordion.Body>
                <Form>
                  <Form.Group controlId="settingsFillStrategy">
                    <Form.Label>Fill Strategy</Form.Label>
                    <Form.Select
                      aria-label="Fill Strategy"
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          fillStrategy: event.target.value,
                        })
                      }
                      value={settings.fillStrategy}
                    >
                      <option value="dominant">DOMINANT (default)</option>
                      <option value="mean">MEAN</option>
                      <option value="median">MEDIAN</option>
                      <option value="spread">SPREAD</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="settingsSteps">
                    <Form.Label>Steps</Form.Label>
                    <Form.Control
                      aria-label="Steps"
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          steps: Number(event.target.value),
                        })
                      }
                      value={settings.steps}
                      type="number"
                      placeholder="auto (default)"
                    />
                  </Form.Group>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Form>

        <Row className="align-items-center mt-4 p-3">
          <Col xs="5" className="text-center">
            {imageLoading ? <Spinner animation="border" /> : null}
            {image.contents && (
              <Image
                src={URL.createObjectURL(new Blob([image.contents]))}
                fluid
              />
            )}
          </Col>
          <Col xs="2" className="text-center">
            <ArrowRight />
          </Col>
          <Col xs="5" className="text-center">
            {svgLoading ? <Spinner animation="border" /> : null}
            {resutlingSvg && (
              <>
                <Row>
                  <Col>
                    <Image src={getSvgDataUrl(resutlingSvg)} fluid />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button className="mt-4" onClick={downloadSvg}>
                      Download
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

const ArrowRight: React.FC<IconProps> = ({ size = "32" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    className="bi bi-arrow-right"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
    />
  </svg>
);

type IconProps = {
  size?: string;
};

const GitHub: React.FC<IconProps> = ({ size = "32" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    className="bi bi-github"
    viewBox="0 0 16 16"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);
