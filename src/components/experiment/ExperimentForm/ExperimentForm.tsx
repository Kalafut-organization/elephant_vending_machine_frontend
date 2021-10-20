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

var form_info = {
  name: '',
  trials: '',
  outcomes: new Map(),
  fixation_duration: '',
  intermediate_duration: '',
  stimuli_duration: '',
  monitor: 2,
  replacement: true,
  fixation_default: true,
  new_fixation: {},
};
var selectedTemp: Array<JSX.Element> = [];
const ExperimentForm = () => {
  const [selectedGroups, setSelectedGroups] = useState<JSX.Element[]>([]);

  const handleChange = (name: any) => {
    if (selectedTemp.includes(name)) {
      const index = selectedTemp.indexOf(name);
      selectedTemp.splice(index, 1);
    } else {
      selectedTemp.push(name);
    }
    setSelectedGroups(generateOutcomes(selectedTemp));
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
            checked={selectedTemp.includes(group)}
            onChange={() => handleChange(group)}
          />
          {group}
        </Row>
      );
    });

    return items;
  };

  const [dropdownLabel, setDropdownLabel] = useState('Select Tray');

  const generateOutcomes = (groupNames: Array<JSX.Element>) => {
    var val = 1;
    const items: Array<JSX.Element> = [];
    form_info.outcomes.clear();
    groupNames.forEach(group => {
      var newOutcomes = { name: '', tray: '' };
      form_info.outcomes.set(group, newOutcomes);
      items.push(
        <InputGroup key={val} className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            {group}
          </InputGroup.Text>
          <FormControl
            placeholder="Treat name"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            onChange={(event: any) => {
              var prev = form_info.outcomes.get(group);
              prev['name'] = event.target.value;
              form_info.outcomes.set(group, prev);
            }}
          />
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {dropdownLabel}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                href="#/action-1"
                onClick={() => {
                  var prev = form_info.outcomes.get(group);
                  prev['tray'] = 1;
                  form_info.outcomes.set(group, prev);
                  setDropdownLabel('Tray 1');
                }}
              >
                Tray 1
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-2"
                onClick={() => {
                  var prev = form_info.outcomes.get(group);
                  prev['tray'] = 2;
                  form_info.outcomes.set(group, prev);
                }}
              >
                Tray 2
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-3"
                onClick={() => {
                  var prev = form_info.outcomes.get(group);
                  prev['tray'] = 3;
                  form_info.outcomes.set(group, prev);
                }}
              >
                Tray 3
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-3"
                onClick={() => {
                  var prev = form_info.outcomes.get(group);
                  prev['tray'] = 0;
                  form_info.outcomes.set(group, prev);
                }}
              >
                None
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </InputGroup>
      );
      val++;
    });
    return items;
  };

  const [isModalOpen, setModalStatus] = useState(true);
  const [groupNames, setGroupNames] = useState([]);
  const [newUpload, setNewUpload] = useState(false);
  var isUploading = false;

  //Validation states
  const [nameValid, setNameValid] = useState(true);
  const [stimuliValid, setStimuliValid] = useState(true);
  const [trialsValid, settrialsValid] = useState(true);
  const [fixationValid, setfixationValid] = useState(true);
  const [intermediateValid, setintermediateValid] = useState(true);
  const [stimDurationValid, setStimDurationValid] = useState(true);
  const [errorChecking, setErrorChecking] = useState(false);
  const [fileValid, setFileValid] = useState(true);

  const validate = () => {
    var errorFree = true;
    if (form_info.name === '') {
      setNameValid(false);
      errorFree = false;
    } else {
      setNameValid(true);
    }
    if (selectedTemp.length === 0) {
      setStimuliValid(false);
      errorFree = false;
    } else {
      setStimuliValid(true);
    }
    if (form_info.trials === '' || isNaN(parseInt(form_info.trials))) {
      settrialsValid(false);
      errorFree = false;
    } else {
      settrialsValid(true);
    }
    if (
      form_info.fixation_duration === '' ||
      isNaN(parseInt(form_info.fixation_duration))
    ) {
      setfixationValid(false);
      errorFree = false;
    } else {
      setfixationValid(true);
    }
    if (
      form_info.intermediate_duration === '' ||
      isNaN(parseInt(form_info.intermediate_duration))
    ) {
      setintermediateValid(false);
      errorFree = false;
    } else {
      setintermediateValid(true);
    }
    if (
      form_info.stimuli_duration === '' ||
      isNaN(parseInt(form_info.stimuli_duration))
    ) {
      setStimDurationValid(false);
      errorFree = false;
    } else {
      setStimDurationValid(true);
    }
    if (
      !form_info.fixation_default &&
      Object.keys(form_info.new_fixation).length === 0
    ) {
      setFileValid(false);
      errorFree = false;
    } else {
      setFileValid(true);
    }
    return errorFree;
  };

  const onFileSelect = (event: any) => {
    form_info.new_fixation = { file: event.target.files[0] };
    if (errorChecking === true) {
      validate();
    }
  };

  useEffect(() => {
    async function fetchGroups(): Promise<void> {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/groups`
        );
        const body = await response.json();
        if (body.names.length > 0) {
          setGroupNames(body.names);
        }
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
          <form>
            <Modal.Header closeButton>
              <Modal.Title>Create New Experiment</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Col>
                <Row style={{ marginBottom: '16px' }}>
                  Experiment name:
                  <InputGroup>
                    <FormControl
                      className="text-field"
                      aria-label="Group name entry form"
                      aria-describedby="addButton"
                      defaultValue={form_info['name']}
                      onChange={(event: any) => {
                        form_info['name'] = event.target.value;
                        if (errorChecking === true) {
                          validate();
                        }
                      }}
                    />
                  </InputGroup>
                  {!nameValid && (
                    <Form.Text
                      style={{
                        fontStyle: 'italic',
                        color: 'red',
                        marginBottom: '10px',
                        fontSize: 'small',
                      }}
                    >
                      Unique name required
                    </Form.Text>
                  )}
                </Row>
                <Row>
                  Number of monitors displaying stimuli:
                  <InputGroup className="mb-3">
                    <Col>
                      <Row>
                        <Form.Check
                          value="1"
                          type="radio"
                          name="stimuli-monitors"
                          defaultChecked
                        />
                        2
                      </Row>
                      <Row>
                        <Form.Check
                          value="2"
                          type="radio"
                          name="stimuli-monitors"
                          onClick={() => (form_info.monitor = 3)}
                        />
                        3
                      </Row>
                    </Col>
                  </InputGroup>
                </Row>
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
                    {!stimuliValid && (
                      <Form.Text
                        style={{
                          fontStyle: 'italic',
                          color: 'red',
                          marginLeft: '-15px',
                          marginTop: '-10px',
                          marginBottom: '10px',
                          fontSize: 'small',
                        }}
                      >
                        At least one stimuli required
                      </Form.Text>
                    )}
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
                  Number of trials:
                  <InputGroup className="mb-3">
                    <FormControl
                      className="text-field"
                      aria-label="Group name entry form"
                      aria-describedby="addButton"
                      defaultValue={form_info['trials']}
                      onChange={(event: any) => {
                        form_info['trials'] = event.target.value;
                        if (errorChecking === true) {
                          validate();
                        }
                      }}
                    />
                    <InputGroup.Text>trials</InputGroup.Text>
                  </InputGroup>
                  {!trialsValid && (
                    <Col>
                      <Form.Text
                        style={{
                          fontStyle: 'italic',
                          color: 'red',
                          marginLeft: '-15px',
                          marginTop: '-10px',
                          marginBottom: '10px',
                          fontSize: 'small',
                        }}
                      >
                        Required and must be a number
                        <p style={{ fontSize: '70%' }}>
                          (Numbers below 0 must be in the form 0.X )
                        </p>
                      </Form.Text>
                    </Col>
                  )}
                </Row>
                <Row>
                  Fixation duration:
                  <InputGroup className="mb-3">
                    <FormControl
                      className="text-field"
                      aria-label="Group name entry form"
                      aria-describedby="addButton"
                      defaultValue={form_info['fixation_duration']}
                      onChange={(event: any) => {
                        form_info['fixation_duration'] = event.target.value;
                        if (errorChecking === true) {
                          validate();
                        }
                      }}
                    />
                    <InputGroup.Text>seconds</InputGroup.Text>
                  </InputGroup>
                  {!fixationValid && (
                    <Col>
                      <Form.Text
                        style={{
                          fontStyle: 'italic',
                          color: 'red',
                          marginLeft: '-15px',
                          marginTop: '-10px',
                          marginBottom: '10px',
                          fontSize: 'small',
                        }}
                      >
                        Required and must be a number
                        <p style={{ fontSize: '70%' }}>
                          (Numbers below 0 must be in the form 0.X )
                        </p>
                      </Form.Text>
                    </Col>
                  )}
                </Row>
                <Row>
                  Duration between fixation and stimuli:
                  <InputGroup className="mb-3">
                    <FormControl
                      className="text-field"
                      aria-label="Group name entry form"
                      aria-describedby="addButton"
                      defaultValue={form_info['intermediate_duration']}
                      onChange={(event: any) => {
                        form_info['intermediate_duration'] = event.target.value;
                        if (errorChecking === true) {
                          validate();
                        }
                      }}
                    />
                    <InputGroup.Text>seconds</InputGroup.Text>
                  </InputGroup>
                  {!intermediateValid && (
                    <Col>
                      <Form.Text
                        style={{
                          fontStyle: 'italic',
                          color: 'red',
                          marginLeft: '-15px',
                          marginTop: '-10px',
                          marginBottom: '10px',
                          fontSize: 'small',
                        }}
                      >
                        Required and must be a number
                        <p style={{ fontSize: '70%' }}>
                          (Numbers below 0 must be in the form 0.X )
                        </p>
                      </Form.Text>
                    </Col>
                  )}
                </Row>
                <Row>
                  Stimuli duration:
                  <InputGroup className="mb-3">
                    <FormControl
                      className="text-field"
                      aria-label="Group name entry form"
                      aria-describedby="addButton"
                      defaultValue={form_info['stimuli_duration']}
                      onChange={(event: any) => {
                        form_info['stimuli_duration'] = event.target.value;
                        if (errorChecking === true) {
                          validate();
                        }
                      }}
                    />
                    <InputGroup.Text>seconds</InputGroup.Text>
                  </InputGroup>
                  {!stimDurationValid && (
                    <Col>
                      <Form.Text
                        style={{
                          fontStyle: 'italic',
                          color: 'red',
                          marginLeft: '-15px',
                          marginTop: '-10px',
                          marginBottom: '10px',
                          fontSize: 'small',
                        }}
                      >
                        Required and must be a number
                        <p style={{ fontSize: '70%' }}>
                          (Numbers below 0 must be in the form 0.X )
                        </p>
                      </Form.Text>
                    </Col>
                  )}
                </Row>
                <Row>
                  Stimuli repetition:
                  <InputGroup className="mb-3">
                    <Col>
                      <Row>
                        <Form.Check
                          value="1"
                          type="radio"
                          name="stimuli-randomness"
                          onClick={() => (form_info.replacement = true)}
                          defaultChecked
                        />
                        With replacement in trials (no repetition)
                      </Row>
                      <Row>
                        <Form.Check
                          value="2"
                          type="radio"
                          name="stimuli-randomness"
                          onClick={() => (form_info.replacement = false)}
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
                          checked={!newUpload}
                          onChange={() => {
                            form_info.fixation_default = true;
                            setNewUpload(false);
                          }}
                        />
                        Standard fixation
                      </Row>
                      <Row>
                        <Form.Check
                          value="2"
                          type="radio"
                          name="fixation-point"
                          checked={newUpload}
                          onChange={() => {
                            form_info.fixation_default = false;
                            setNewUpload(true);
                          }}
                        />
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
                              controlId="formFixationFile"
                              onClick={(event: any) => {
                                onFileSelect(event);
                                form_info.fixation_default = false;
                                setNewUpload(true);
                              }}
                              onChange={(event: any) => {
                                form_info.fixation_default = false;
                                onFileSelect(event);
                                setNewUpload(true);
                              }}
                            >
                              <Form.Control type="file" />
                            </Form.Group>
                            {!fileValid && (
                              <Form.Text
                                style={{
                                  fontStyle: 'italic',
                                  color: 'red',
                                  marginTop: '-10px',
                                  fontSize: 'small',
                                }}
                              >
                                Choose file to upload
                              </Form.Text>
                            )}
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
                  setErrorChecking(true);
                  if (validate()) {
                    setModalStatus(false);
                  }
                }}
              >
                Save
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ExperimentForm;
