import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import ExperimentBlock from './experimentBlock';

const generateItems = (experimentUrls: Array<string>) => {
  const items: Array<JSX.Element> = [];
  experimentUrls.forEach(url => {
    items.push(<ExperimentBlock url={url} key={url} />);
  });

  return items;
};

const ExperimentRunner: React.FC = () => {
  const [hasError, setErrors] = useState(false);
  const [experimentUrls, setExperimentUrls] = useState([]);
  const [isRunning, setRunExp] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState({ file: null });

  useEffect(() => {
    async function fetchExperimentUrls(): Promise<void> {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/experiment`
        );
        const body = await response.json();
        setExperimentUrls(body.files);
      } catch (err) {
        setErrors(err);
      }
    }

    if (!isRunning) fetchExperimentUrls();
  }, [isRunning]);

  const onFileSelect = async (e: any) => {
    setSelectedFile({ file: e.target.files[0] });
  };

  const handleRunClick = async () => {
    const formData = new FormData();
    if (selectedFile && selectedFile.file) {
      formData.append('file', (selectedFile.file as unknown) as File);
    }
    setRunExp(true);
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/run-experiment`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const body = await response.json();
    setResponseMessage(body.message);
    setShowToast(true);
    setSelectedFile({ file: null });
  };

  return (
    <Container>
      {!hasError && (
        <Row style={{ marginBottom: '1em' }}>
          <Col>
            <div className="input-group">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  id="RunButton"
                  style={{
                    cursor:
                      selectedFile.file !== null ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => {
                    selectedFile.file && handleRunClick();
                  }}
                  onKeyDown={() => {
                    selectedFile.file && handleRunClick();
                  }}
                  role="button"
                  tabIndex={0}
                >
                  Run
                </span>
              </div>
            </div>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <ListGroup>
            {hasError && (
              <div>Error encountered while loading experiments.</div>
            )}
            {experimentUrls && generateItems(experimentUrls)}
          </ListGroup>
        </Col>
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

export default ExperimentRunner;
