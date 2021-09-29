import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const deleteGroup = async (name: string) => {
  await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/groups/${name}`, {
    method: 'delete',
  });
  window.location.reload();
};

export interface GroupCardProps {
  /** Name of the group the card represents */
  name: string;
}

const GroupCard: React.FC<GroupCardProps> = ({ name }: GroupCardProps) => {
  const [isModalOpen, setModalStatus] = useState(false);

  return (
    <Col md={6} lg={4} xl={3} className="py-2">
      <Card className="mb-4 h-100">
        <Card.Img
          variant="top"
          src={
            'https://img.icons8.com/office/160/000000/folder-invoices--v1.png'
          }
          className="img-fluid"
        />
        <Card.Body className="d-flex flex-column">
          <Card.Text className="mt-auto">{name}</Card.Text>
          <div>
            <Button
              href={`/groups/"${name}`}
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
            <Modal.Title>Confirm Group Deletion</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <h1>
              Are you sure you want to delete the "{name}" group? All stimuli in
              this group will be deleted
            </h1>
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
                deleteGroup(name);
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

export default GroupCard;
