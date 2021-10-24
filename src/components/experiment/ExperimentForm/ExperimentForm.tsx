import React, { useState } from 'react';
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
import { monitorEventLoopDelay } from 'perf_hooks';

var form_info = {
  name: '',
  trials: '',
  outcomes: new Map(),
  fixation_duration: '',
  intermediate_duration: '',
  stimuli_duration: '',
  monitors: [true, false, true],
  replacement: true,
  fixation_default: true,
  new_fixation: {},
  groups: [],
};

var selectedTemp: Array<JSX.Element> = [];

const ExperimentForm = () => {
  const [selectedGroups, setSelectedGroups] = useState<JSX.Element[]>([]);

  const handleChange = (name: any) => {
    var newTemp: Array<JSX.Element> = [];
    newTemp = selectedTemp;
    selectedTemp = [];
    for (var i = 0; i < newTemp.length; i++) {
      selectedTemp.push(newTemp[i]);
    }
    if (form_info.outcomes.has(name)) {
      const index = selectedTemp.indexOf(name);
      selectedTemp.splice(index, 1);
      form_info.outcomes.delete(name);
      const outcome_index = outcomeErrors.indexOf(name);
      outcomeErrors.splice(outcome_index, 1);
    } else {
      selectedTemp.push(name);
      form_info.outcomes.set(name, { name: '', tray: '' });
    }
    setSelectedGroups(selectedTemp);
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
            className="stimuli-group"
            onChange={() => {
              handleChange(group);
              setSelectedGroups(selectedTemp);
              if (errorChecking) {
                validate();
              }
            }}
          />
          {group}
        </Row>
      );
    });

    return items;
  };

  const [isModalOpen, setModalStatus] = useState(false);
  const [groupNames, setGroupNames] = useState([]);
  const [newUpload, setNewUpload] = useState(false);
  const [monitors, setMonitors] = useState([true, false, true]);

  //Validation states
  const [nameValid, setNameValid] = useState(true);
  const [monitorsValid, setMonitorsValid] = useState(true);
  const [stimuliValid, setStimuliValid] = useState(true);
  const [trialsValid, settrialsValid] = useState(true);
  const [fixationValid, setfixationValid] = useState(true);
  const [intermediateValid, setintermediateValid] = useState(true);
  const [stimDurationValid, setStimDurationValid] = useState(true);
  const [errorChecking, setErrorChecking] = useState(false);
  const [outcomeErrors, setOutcomeErrors] = useState<JSX.Element[]>([]);
  const [fileValid, setFileValid] = useState(true);

  const validate = () => {
    var errorFree = true;
    if (form_info.name === '') {
      setNameValid(false);
      errorFree = false;
    } else {
      setNameValid(true);
    }
    if (
      form_info.monitors[0] === false &&
      form_info.monitors[1] === false &&
      form_info.monitors[2] === false
    ) {
      setMonitorsValid(false);
      errorFree = false;
    } else {
      setMonitorsValid(true);
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
    var outcomeErrorsTemp: Array<JSX.Element> = [];
    form_info.outcomes.forEach((group, name) => {
      if (group['name'] === '' || group['tray'] === '') {
        outcomeErrorsTemp.push(name);
        errorFree = false;
      }
    });
    setOutcomeErrors(outcomeErrorsTemp);
    return errorFree;
  };

  const onFileSelect = (event: any) => {
    form_info.new_fixation = { file: event.target.files[0] };
    if (errorChecking === true) {
      validate();
    }
  };

  const getName = (name: any) => {
    if (form_info.outcomes.has(name)) {
      var data = form_info.outcomes.get(name);
      if (data['tray'] === '') {
        return 'Select tray';
      } else {
        return 'Tray ' + data['tray'];
      }
    }
  };

  // useEffect(() => {
  //   async function fetchGroups(): Promise<void> {
  //     try {
  //       const response = await fetch(
  //         `${process.env.REACT_APP_BACKEND_ADDRESS}/groups`
  //       );
  //       const body = await response.json();
  //       if (body.names.length > 0) {
  //         setGroupNames(body.names);
  //       }
  //     } catch (err) {
  //       // setErrors(true);
  //     }
  //   }

  //   if (!isUploading) fetchGroups();
  // }, [isUploading]);

  const getGroups = async () => {
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
  };

  const updateMonitorArrayIndex = (index: number, e: any) => {
    const m = monitors;
    m[index] = e.target.checked;
    setMonitors(m);
    form_info.monitors = monitors;
  };

  return (
    <div>
      <Button
        variant="secondary"
        style={{ float: 'right', marginTop: '16px' }}
        className="mr-1 create-form-button"
        onClick={() => {
          getGroups();
          setModalStatus(true);
        }}
      >
        Add new from parameters
      </Button>
      <div className="modal-div">
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
                      className="name-text"
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
                      className="name-error"
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
                  <Col>
                    <Row>Monitors used to display stimuli:</Row>
                    <Row>
                      <p style={{ fontStyle: 'italic', color: 'grey' }}>
                        The fixation will be shown on the center screen.
                      </p>
                    </Row>
                    {!monitorsValid && (
                      <Form.Text
                        className="monitors-selection-error"
                        style={{
                          fontStyle: 'italic',
                          color: 'red',
                          marginLeft: '-15px',
                          marginTop: '-10px',
                          marginBottom: '10px',
                          fontSize: 'small',
                        }}
                      >
                        At least one monitor required
                      </Form.Text>
                    )}
                  </Col>
                  <InputGroup className="mb-3">
                    <Col>
                      <Row>
                        <Col>
                          <Form.Check
                            value="1"
                            type="checkbox"
                            name="stimuli-monitor-0"
                            defaultChecked={monitors[0]}
                            onChange={(event: any) => {
                              updateMonitorArrayIndex(0, event);
                              if (errorChecking === true) {
                                validate();
                              }
                            }}
                          />
                          Left
                        </Col>
                        <Col>
                          <Form.Check
                            value="2"
                            type="checkbox"
                            name="stimuli-monitor-1"
                            defaultChecked={monitors[1]}
                            onChange={(event: any) => {
                              updateMonitorArrayIndex(1, event);
                              if (errorChecking === true) {
                                validate();
                              }
                            }}
                          />
                          Center
                        </Col>
                        <Col>
                          <Form.Check
                            value="2"
                            type="checkbox"
                            name="stimuli-monitor-2"
                            defaultChecked={monitors[2]}
                            onChange={(event: any) => {
                              updateMonitorArrayIndex(2, event);
                              if (errorChecking === true) {
                                validate();
                              }
                            }}
                          />
                          Right
                        </Col>
                      </Row>
                    </Col>
                  </InputGroup>
                </Row>
                <Row>
                  <Col className="all-groups">
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
                        className="stimuli-selection-error"
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
                    {selectedGroups.length > 0 &&
                      selectedGroups.map((group, i) => (
                        <div key={i}>
                          <Row style={{ marginBottom: '12px' }}>
                            <InputGroup>
                              <InputGroup.Text id="inputGroup-sizing-default">
                                {group}
                              </InputGroup.Text>
                              <FormControl
                                className="outcome-field"
                                placeholder="Treat name"
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                onChange={(event: any) => {
                                  var data = form_info.outcomes.get(group);
                                  data['name'] = event.target.value;
                                  form_info.outcomes.set(group, data);
                                  if (errorChecking === true) {
                                    validate();
                                  }
                                }}
                              />
                              <Dropdown>
                                <Dropdown.Toggle
                                  className="dropdown-toggle"
                                  variant="secondary"
                                  id="dropdown-basic"
                                >
                                  {getName(group)}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    className="outcome-tray-1"
                                    href="#/action-1"
                                    onClick={() => {
                                      var data = form_info.outcomes.get(group);
                                      data['tray'] = 1;
                                      form_info.outcomes.set(group, data);
                                      if (errorChecking === true) {
                                        validate();
                                      }
                                    }}
                                  >
                                    Tray 1
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    className="outcome-tray-2"
                                    href="#/action-2"
                                    onClick={() => {
                                      var data = form_info.outcomes.get(group);
                                      data['tray'] = 2;
                                      form_info.outcomes.set(group, data);
                                      if (errorChecking === true) {
                                        validate();
                                      }
                                    }}
                                  >
                                    Tray 2
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    className="outcome-tray-3"
                                    href="#/action-3"
                                    onClick={() => {
                                      var data = form_info.outcomes.get(group);
                                      data['tray'] = 3;
                                      form_info.outcomes.set(group, data);
                                      if (errorChecking === true) {
                                        validate();
                                      }
                                    }}
                                  >
                                    Tray 3
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    className="outcome-none"
                                    href="#/action-3"
                                    onClick={() => {
                                      var data = form_info.outcomes.get(group);
                                      data['tray'] = 0;
                                      form_info.outcomes.set(group, data);
                                      if (errorChecking === true) {
                                        validate();
                                      }
                                    }}
                                  >
                                    None
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </InputGroup>
                            {outcomeErrors.includes(group) && (
                              <Form.Text
                                className="outcome-error"
                                style={{
                                  fontStyle: 'italic',
                                  color: 'red',
                                  marginBottom: '10px',
                                  fontSize: 'small',
                                }}
                              >
                                Missing treat name and/or tray selection.
                              </Form.Text>
                            )}
                          </Row>{' '}
                        </div>
                      ))}
                  </Col>
                </Row>
                <Row>
                  Number of trials:
                  <InputGroup className="mb-3">
                    <FormControl
                      className="trials-field"
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
                        className="trials-error"
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
                      className="fixation-field"
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
                        className="fixation-error"
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
                      className="intermediate-field"
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
                        className="intermediate-error"
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
                      className="stimduration-field"
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
                        className="stimDuration-error"
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
                          className="fixation-point"
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
                          className="fixation-point"
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
                              className="border border-10 fixation-upload"
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
                                className="file-error"
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
