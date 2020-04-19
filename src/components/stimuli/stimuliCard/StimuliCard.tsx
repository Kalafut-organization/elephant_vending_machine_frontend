import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const deleteStimuliFile = async (filename: string) => {
  await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/image/${filename}`, {
    method: 'delete',
  });
  window.location.reload(false);
};

export interface StimuliCardProps {
  /** URL of the image displayed on card */
  url: string;
}

const StimuliCard: React.FC<StimuliCardProps> = ({ url }: StimuliCardProps) => {
  const [isModalOpen, setModalStatus] = useState(false);

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
          <div>
            <Button
              href={url}
              variant="secondary"
              className="align-self-start align-self-bottom mr-2"
            >
              View
            </Button>
            <Button
              variant="danger"
              className="align-self-start align-self-bottom"
              onClick={() => {
                setModalStatus(true);
              }}
            >
              Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
      <div>
        <Modal
          className="modal-container"
          show={isModalOpen}
          onHide={() => setModalStatus(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm File Deletion</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <h1>Are you sure you want to delete {filename}?</h1>
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="cancel-delete"
              variant="secondary"
              onClick={() => setModalStatus(false)}
            >
              Cancel
            </Button>
            <Button
              className="confirm-delete"
              variant="danger"
              onClick={() => {
                deleteStimuliFile(filename);
                setModalStatus(false);
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Col>
  );
};

export default StimuliCard;
