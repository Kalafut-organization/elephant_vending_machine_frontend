import React, { ReactElement, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Modal, Button } from 'react-bootstrap';

interface ExperimentBlockProps {
  url: string;
}

const ExperimentBlock = ({
  url,
}: ExperimentBlockProps): ReactElement<ExperimentBlockProps> => {
  const [isModalOpen, setModalStatus] = useState(false);
  const filenameExpression = new RegExp(
    `${process.env.REACT_APP_BACKEND_ADDRESS}/static/experiment/(.*)`
  );
  const match = filenameExpression.exec(url);
  const filename = match ? match[1] : 'unknown filename';

  const runExperimentFile = async () => {
    await fetch(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/run-experiment/${filename}`,
      { method: 'post' }
    );
    window.location.reload(false);
  };

  return (
    <ListGroup.Item className="experiment-item">
      <span>{filename}</span>
      <Button
        variant="secondary"
        style={{ float: 'right' }}
        className="mr-1 run-button"
        onClick={() => {
          setModalStatus(true);
        }}
      >
        Run
      </Button>
      <div>
        <Modal
          className="modal-container"
          show={isModalOpen}
          onHide={() => setModalStatus(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Running Experiment</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <h1>Are you sure you want to run {filename}?</h1>
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="cancel-run"
              variant="secondary"
              onClick={() => setModalStatus(false)}
            >
              Cancel
            </Button>
            <Button
              className="confirm-run"
              variant="primary"
              onClick={() => {
                setModalStatus(false);
                runExperimentFile();
              }}
            >
              Run
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </ListGroup.Item>
  );
};

export default ExperimentBlock;
