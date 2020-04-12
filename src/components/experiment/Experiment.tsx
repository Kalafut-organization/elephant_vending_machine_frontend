import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import ExperimentItem from './ExperimentItem';

function generateItems(experimentUrls: Array<string>) {
  const items: Array<JSX.Element> = [];
  experimentUrls.forEach(url => {
    items.push(<ExperimentItem url={url} key={url} />);
  });

  return items;
}

const buildFileSelector = (): HTMLInputElement => {
  const fileSelector: HTMLInputElement = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('accept', '.py');
  fileSelector.setAttribute('multiple', 'single');

  return fileSelector;
};

const Experiment: React.FC = () => {
  const [hasError, setErrors] = useState(false);
  const [experimentUrls, setExperimentUrls] = useState([]);
  const [isUploading, setUploading] = useState(false);
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

    if (!isUploading) fetchExperimentUrls();
  }, [isUploading]);

  const onFileSelect = async (e: any) => {
    setSelectedFile({ file: e.target.files[0] });
  };

  const fileSelector: HTMLInputElement = buildFileSelector();
  fileSelector.onchange = onFileSelect;

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

  const handleFileSelect = (e: any) => {
    e.preventDefault();
    fileSelector.click();
  };

  return (
    <Container>
      {!hasError && (
        <Row>
          <Col>
            <div className="input-group">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  style={{
                    cursor:
                      selectedFile.file !== null ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => {
                    selectedFile.file && handleUploadClick();
                  }}
                >
                  Upload
                </span>
              </div>
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  onClick={handleFileSelect}
                />
                <label className="custom-file-label">
                  {selectedFile.file !== null
                    ? ((selectedFile.file as unknown) as File).name
                    : 'Select a file to upload'}
                </label>
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

export default Experiment;
