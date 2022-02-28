import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ChangeEventHandler, MouseEventHandler } from "react";

type Props = {
  onImageChange: ChangeEventHandler<HTMLInputElement>;
  onImageUpload: MouseEventHandler<HTMLButtonElement>;
};

export const ImageForm: React.FC<Props> = ({
  onImageChange,
  onImageUpload,
}) => {
  return (
    <Form className="p-3">
      <Row>
        <Col xs="6" md="10">
          <Form.Control type="file" onChange={onImageChange} />
        </Col>
        <Col xs="6" md="2" className="text-center">
          <Button variant="primary" type="submit" onClick={onImageUpload}>
            Upload
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
