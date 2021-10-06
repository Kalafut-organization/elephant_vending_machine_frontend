import React, { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GroupCard from './GroupCard';
import { Button, InputGroup, FormControl } from 'react-bootstrap';

const generateCards = (groupNames: Array<string>): Array<JSX.Element> => {
  const cards: Array<JSX.Element> = [];
  groupNames.forEach(name => {
    cards.push(<GroupCard name={name} key={name} />);
  });

  return cards;
};

const Group: React.FC = () => {
  const [hasError, setErrors] = useState(false);
  const [groupNames, setGroupNames] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedName, setSelectedName] = useState('');

  useEffect(() => {
    async function fetchGroups(): Promise<void> {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/groups`
        );
        const body = await response.json();
        setGroupNames(body.names);
      } catch (err) {
        setErrors(true);
      }
    }

    if (!isUploading) fetchGroups();
  }, [isUploading]);

  const onNameSelect = (event: any) => {
    setSelectedName(event.target.value);
  };

  const handleAddClick = async () => {
    const formData = new FormData();
    if (selectedName !== '') {
      formData.append('name', selectedName);
    }
    setUploading(true);
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/groups`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const body = await response.json();
    setResponseMessage(body.message);
    setUploading(false);
    setShowToast(true);
  };

  return (
    <Container>
      <Row style={{ marginBottom: '1em' }}>
        <Col>
          <InputGroup className="mb-3">
            <Button
              className="input-group-text"
              variant="outline-secondary"
              id="addButton"
              onClick={() => {
                handleAddClick();
              }}
            >
              {isUploading ? (
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                'Add new group'
              )}
            </Button>
            <FormControl
              className="text-field"
              aria-label="Group name entry form"
              aria-describedby="addButton"
              onChange={onNameSelect}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className="content">
        {hasError && <div>Error encountered while loading groups.</div>}
        {(groupNames === undefined || (!groupNames.length && !hasError)) && (
          <div>No groups currently exist.</div>
        )}
        {groupNames && generateCards(groupNames)}
      </Row>
      {showToast && (
        <Row>
          <Col>
            <div>
              <Toast
                style={{
                  position: 'sticky',
                }}
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={3000}
                autohide
              >
                <Toast.Body>{responseMessage}</Toast.Body>
              </Toast>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Group;
