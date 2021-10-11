import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import ExperimentItem from './ExperimentItem';
import ExperimentForm from './ExperimentForm';

const generateItems = (experimentUrls: Array<string>) => {
  const items: Array<JSX.Element> = [];
  experimentUrls.forEach(url => {
    items.push(<ExperimentItem url={url} key={url} />);
  });

  return items;
};

const Experiment: React.FC = () => {
  const [hasError, setErrors] = useState(false);
  const [experimentUrls, setExperimentUrls] = useState([]);
  const [sampleExperimentUrls, setSampleExperimentUrls] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState({ file: null });

  useEffect(() => {
    async function fetchExperimentUrls(): Promise<void> {
      try {
        // fetch experiment urls
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/experiment`
        );
        const body = await response.json();
        setExperimentUrls(body.files);

        // fetch sample experiment url
        const sample_response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/template`
        );
        const sample_body = await sample_response.json();
        setSampleExperimentUrls(sample_body.files);
      } catch (err) {
        setErrors(err);
      }
    }

    if (!isUploading) fetchExperimentUrls();
  }, [isUploading]);

  const onFileSelect = async (e: any) => {
    setSelectedFile({ file: e.target.files[0] });
  };

  const handleUploadClick = async () => {
    const formData = new FormData();
    if (selectedFile && selectedFile.file) {
      formData.append('file', (selectedFile.file as unknown) as File);
    }
    setUploading(true);
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/experiment`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const body = await response.json();
    setResponseMessage(body.message);
    setUploading(false);
    setShowToast(true);
    setSelectedFile({ file: null });
  };

  return (
    <Container>
      {!hasError && (
        <Row style={{ marginBottom: '1em' }}>
          <Col>
            <Row>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text upload-button"
                    id="uploadButton"
                    style={{
                      cursor:
                        selectedFile.file !== null ? 'pointer' : 'not-allowed',
                    }}
                    onClick={() => {
                      selectedFile.file && handleUploadClick();
                    }}
                    onKeyDown={() => {
                      selectedFile.file && handleUploadClick();
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {isUploading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      'Upload'
                    )}
                  </span>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    className="custom-file-input"
                    onChange={onFileSelect}
                  />
                  <label className="custom-file-label">
                    {selectedFile.file !== null
                      ? ((selectedFile.file as unknown) as File).name
                      : 'Select a file to upload'}
                  </label>
                </div>
              </div>
            </Row>
            <Row>
              <ExperimentForm />
              <Button
                type="submit"
                variant="secondary"
                style={{ marginTop: '16px' }}
                className="mr-1 form-button"
                onClick={() => {
                  window.open(sampleExperimentUrls[0]);
                }}
              >
                Download Sample
              </Button>
            </Row>
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

export default Experiment;
