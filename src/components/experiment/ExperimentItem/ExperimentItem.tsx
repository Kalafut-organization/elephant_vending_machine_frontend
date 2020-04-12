import React, { ReactElement, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Modal, Button } from 'react-bootstrap';

interface ExperimentItemProps {
  url: string;
}

async function deleteExperimentFile(filename: string) {
  await fetch(
    `${process.env.REACT_APP_BACKEND_ADDRESS}/experiment/${filename}`,
    { method: 'delete' }
  );
  window.location.reload(false);
}

function ExperimentItem({
  url,
}: ExperimentItemProps): ReactElement<ExperimentItemProps> {
  const [isModalOpen, setModalStatus] = useState(false);
  const filenameExpression = new RegExp(
    `${process.env.REACT_APP_BACKEND_ADDRESS}/static/experiment/(.*)`
  );
  const match = filenameExpression.exec(url);
  const filename = match ? match[1] : 'unknown filename';

  return (
    <ListGroup.Item>
      <span>{filename}</span>
      <Button href={url} style={{ float: 'right' }} className="mr-1">
        View
      </Button>
      <Button
        variant="danger"
        style={{ float: 'right' }}
        className="mr-1"
        onClick={() => {
          setModalStatus(true);
        }}
      >
        Delete
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
              variant="danger"
              onClick={() => {
                deleteExperimentFile(filename);
                setModalStatus(false);
              }}
            >
              Yes
            </Button>
            <Button onClick={() => setModalStatus(false)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </ListGroup.Item>
  );
}

export default ExperimentItem;
