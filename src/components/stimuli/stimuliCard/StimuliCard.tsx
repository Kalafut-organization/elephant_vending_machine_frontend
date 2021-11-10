import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const deleteStimuliFile = async (
  filename: string,
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>,
  setResponseMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_ADDRESS}/image/${filename}`,
    {
      method: 'delete',
    }
  );
  const body = await response.json();
  if (body.status !== 200) {
    setResponseMessage(body.message);
    setShowToast(true);
  } else {
    window.location.reload();
  }
};

export interface StimuliCardProps {
  /** URL of the image displayed on card */
  url: string;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  setResponseMessage: React.Dispatch<React.SetStateAction<string>>;
}

const StimuliCard: React.FC<StimuliCardProps> = ({
  url,
  setShowToast,
  setResponseMessage,
}: StimuliCardProps) => {
  const [isCopyModalOpen, setCopyModalStatus] = useState(false);
  const [isDeleteModalOpen, setDeleteModalStatus] = useState(false);
  const [folderToCopy, setFolderToCopy] = useState('');

  const copyStimuliFile = async (filename: string) => {
    const formData = new FormData();
    if (folderToCopy) {
      formData.append('name', folderToCopy);
    }
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/${filename}/copy`,
      {
        method: 'post',
        body: formData,
      }
    );
    const body = await response.json();
    setResponseMessage(body.message);
    setShowToast(true);
  };

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
              variant="info"
              className="align-self-start align-self-bottom m-2"
            >
              View
            </Button>
            <Button
              variant="info"
              className="align-self-start align-self-bottom m-2"
              onClick={() => {
                setCopyModalStatus(true);
              }}
            >
              Copy to Folder
            </Button>
            <Button
              variant="danger"
              className="align-self-start align-self-bottomm m-2"
              onClick={() => {
                setDeleteModalStatus(true);
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
          show={isDeleteModalOpen}
          onHide={() => setDeleteModalStatus(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm File Deletion</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Are you sure you want to delete the file '{filename}'?</p>
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="cancel-delete"
              variant="secondary"
              onClick={() => setDeleteModalStatus(false)}
            >
              Cancel
            </Button>
            <Button
              className="confirm-delete"
              variant="danger"
              onClick={() => {
                deleteStimuliFile(filename, setShowToast, setResponseMessage);
                setDeleteModalStatus(false);
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          className="modal-container"
          show={isCopyModalOpen}
          onHide={() => setCopyModalStatus(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Copy to Folder</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>
              Enter the name of the folder would like '{filename}' to be copied
              to.
            </p>
            <input
              type="text"
              onChange={e => setFolderToCopy(e.target.value)}
              value={folderToCopy}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="cancel-copy"
              variant="secondary"
              onClick={() => setCopyModalStatus(false)}
            >
              Cancel
            </Button>
            <Button
              className="confirm-copy"
              variant="info"
              onClick={() => {
                copyStimuliFile(filename);
                setCopyModalStatus(false);
              }}
            >
              Copy
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Col>
  );
};

export default StimuliCard;
