import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { MouseEventHandler } from "react";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
import { ArrowRight } from "./icons/ArrowRight";
import { getSvgDataUrl } from "../utils/svg";

type Props = {
  inputImageLoading: boolean;
  inputImage: ArrayBuffer;
  outputSvgLoading: boolean;
  outputSvg: string;
};

export const ImagesView: React.FC<Props> = ({
  inputImage: image,
  inputImageLoading: imageLoading,
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
    <Row className="align-items-center mt-4 p-3">
      <Col xs="5" className="text-center">
        {imageLoading ? <Spinner animation="border" /> : null}
        {image && <Image src={URL.createObjectURL(new Blob([image]))} fluid />}
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
  );
};
