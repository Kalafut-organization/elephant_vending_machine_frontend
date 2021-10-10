import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  InputGroup,
  FormControl,
  Form,
  Dropdown,
} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

var selectedTemp: Array<JSX.Element> = [];
const ExperimentForm = () => {
  const [selectedGroups, setSelectedGroups] = useState<JSX.Element[]>([]);

  const handleChange = (name: any) => {
    console.log(selectedGroups, name);

    if (selectedTemp.includes(name)) {
      const index = selectedTemp.indexOf(name);
      selectedTemp.splice(index, 1);
    } else {
      selectedTemp.push(name);
    }
    setSelectedGroups(generateOutcomes(selectedTemp));
    console.log('AFTER');
    console.log(selectedGroups, name);
  };

  const generateGroups = (groupNames: Array<JSX.Element>) => {
    const items: Array<JSX.Element> = [];
    groupNames.forEach(group => {
      items.push(
        <Row
          key={'row' + group}
          style={{
            borderColor: '#ced4da',
            borderStyle: 'solid',
            borderRadius: '0.25rem',
            padding: '12px',
            marginTop: '8px',
          }}
          className="border border-5"
        >
          <Form.Check
            value={'form-' + group}
            name="stimuli-randomness"
            onChange={() => handleChange(group)}
          />
          {group}
        </Row>
      );
    });

    return items;
  };

  const generateOutcomes = (groupNames: Array<JSX.Element>) => {
    console.log('HERE');
    var val = 1;
    const items: Array<JSX.Element> = [];
    groupNames.forEach(group => {
      items.push(
        <InputGroup key={val} className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            {group}
          </InputGroup.Text>
          <FormControl
            placeholder="Treat name"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          />
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              Select Tray
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Tray 1</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Tray 2</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Tray 3</Dropdown.Item>
              <Dropdown.Item href="#/action-3">None</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </InputGroup>
      );
      val++;
    });
    return items;
  };

  const [isModalOpen, setModalStatus] = useState(false);
  const [groupNames, setGroupNames] = useState([]);
  var isUploading = false;

  useEffect(() => {
    async function fetchGroups(): Promise<void> {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/groups`
        );
        const body = await response.json();
        setGroupNames(body.names);
      } catch (err) {
        // setErrors(true);
      }
    }

    if (!isUploading) fetchGroups();
  }, [isUploading]);

  return (
    <div>
      <Button
        variant="secondary"
        style={{ float: 'right', marginTop: '16px' }}
        className="mr-1 form-button"
        onClick={() => {
          setModalStatus(true);
        }}
      >
        Add new from parameters
      </Button>
      <div>
        <Modal
          className="modal-container"
          show={isModalOpen}
          onHide={() => setModalStatus(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create New Experiment</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Col>
              <Row>
                <Col>
                  <Row>Stimuli:</Row>
                  {groupNames.length === 0 && (
                    <Row>No groups found. Add groups and then continue. </Row>
                  )}
                  <InputGroup className="mb-3">
                    <Col style={{ padding: '0px' }}>
                      {groupNames.length > 0 && generateGroups(groupNames)}
                    </Col>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row style={{ marginBottom: '5px' }}>Stimuli outcomes:</Row>
                  {selectedGroups.length === 0 && (
                    <Row>
                      <p style={{ fontStyle: 'italic', color: 'grey' }}>
                        Please select stimuli first.
                      </p>
                    </Row>
                  )}
                  {selectedGroups}
                </Col>
              </Row>
              <Row>
                Fixation duration:
                <InputGroup className="mb-3">
                  <FormControl
                    className="text-field"
                    aria-label="Group name entry form"
                    aria-describedby="addButton"
                    // onChange={}
                  />
                  <InputGroup.Text>seconds</InputGroup.Text>
                </InputGroup>
              </Row>
              <Row>
                Duration between fixation and stimuli:
                <InputGroup className="mb-3">
                  <FormControl
                    className="text-field"
                    aria-label="Group name entry form"
                    aria-describedby="addButton"
                    // onChange={}
                  />
                  <InputGroup.Text>seconds</InputGroup.Text>
                </InputGroup>
              </Row>
              <Row>
                Stimuli duration:
                <InputGroup className="mb-3">
                  <FormControl
                    className="text-field"
                    aria-label="Group name entry form"
                    aria-describedby="addButton"
                    // onChange={}
                  />
                  <InputGroup.Text>seconds</InputGroup.Text>
                </InputGroup>
              </Row>
              <Row>
                Stimuli randomness:
                <InputGroup className="mb-3">
                  <Col>
                    <Row>
                      <Form.Check
                        value="1"
                        type="radio"
                        name="stimuli-randomness"
                      />
                      With replacement in trials (no repetition)
                    </Row>
                    <Row>
                      <Form.Check
                        value="2"
                        type="radio"
                        name="stimuli-randomness"
                      />
                      Without replacement in trials (repetition possible)
                    </Row>
                  </Col>
                </InputGroup>
              </Row>
              <Row>
                Fixation point:
                <InputGroup className="mb-3">
                  <Col>
                    <Row>
                      <Form.Check
                        value="1"
                        type="radio"
                        name="fixation-point"
                      />
                      Standard fixation
                    </Row>
                    <Row>
                      <Form.Check value="2" type="radio" name="fixation-new" />
                      <Col>
                        <Row>Upload new</Row>
                        <Row>
                          <Form.Group
                            style={{
                              borderStyle: 'solid',
                              borderColor: '#ced4da',
                              borderRadius: '.25rem',
                              width: '100%',
                            }}
                            className="border border-10"
                            controlId="formFile"
                          >
                            <Form.Control type="file" />
                          </Form.Group>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </InputGroup>
              </Row>
            </Col>
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="cancel-form"
              variant="secondary"
              onClick={() => setModalStatus(false)}
            >
              Cancel
            </Button>
            <Button
              className="confirm-form"
              variant="primary"
              onClick={() => {
                setModalStatus(false);
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ExperimentForm;
