import React from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export interface StimuliCardProps {
  /** URL of the image displayed on card */
  url: string;
}

const StimuliCard: React.FC<StimuliCardProps> = ({ url }: StimuliCardProps) => {
  const filenameExpression: RegExp = new RegExp(
    `${process.env.REACT_APP_BACKEND_ADDRESS}/static/img/(.*)`
  );
  const match: RegExpExecArray | null = filenameExpression.exec(url);
  const filename: string = match ? match[1] : 'unknown filename';

  return (
    <Col md={6} lg={4} xl={3} className="py-2">
      <Card className="mb-4 h-100">
        <Card.Img variant="top" src={url} className="img-fluid" />
        <Card.Body className="d-flex flex-column">
          <Card.Text className="mt-auto">{filename}</Card.Text>
          <Button
            href={url}
            variant="secondary"
            className="align-self-start align-self-bottom"
          >
            View
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default StimuliCard;
