import React, { ReactElement, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Modal, Button } from 'react-bootstrap';

interface ExperimentItemProps {
  url: string;
}

const deleteExperimentFile = async (filename: string) => {
  await fetch(
    `${process.env.REACT_APP_BACKEND_ADDRESS}/experiment/${filename}`,
    { method: 'delete' }
  );
  window.location.reload(false);
};

const ExperimentItem = ({
  url,
}: ExperimentItemProps): ReactElement<ExperimentItemProps> => {
  const [isModalOpen, setModalStatus] = useState(false);
  const filenameExpression = new RegExp(
    `${process.env.REACT_APP_BACKEND_ADDRESS}/static/experiment/(.*)`
  );
  const match = filenameExpression.exec(url);
  const filename = match ? match[1] : 'unknown filename';

  return (
    <ListGroup.Item className="experiment-item">
      <span>{filename}</span>
      <Button
        variant="danger"
        style={{ float: 'right' }}
        className="mr-1 delete-button"
        onClick={() => {
          setModalStatus(true);
        }}
      >
        Delete
      </Button>
      <Button
        href={url}
        style={{ float: 'right' }}
        className="mr-1 view-button"
      >
        View
      </Button>
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
              onClick={() => setModalStatus(false)}
            >
              Cancel
            </Button>
            <Button
              className="confirm-delete"
              variant="danger"
              onClick={() => {
                deleteExperimentFile(filename);
                setModalStatus(false);
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </ListGroup.Item>
  );
};

export default ExperimentItem;
