import React, { useEffect, useState, useRef } from 'react';
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
  const [responseMessage, setResponseMessage] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [selectedFilename, setSelectedFilename] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

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
    setFileSelected(true);
    if (fileInput && fileInput.current) {
      fileInput.current.files = e.target.files;
    }
    setSelectedFilename(e.target.files[0]?.name as string);
  };

  const fileSelector: HTMLInputElement = buildFileSelector();
  fileSelector.onchange = onFileSelect;

  const handleUploadClick = async () => {
    const formData = new FormData();
    if (fileInput && fileInput.current && fileInput.current.files) {
      formData.append('file', fileInput.current.files[0]);
    }
    setUploading(true);
    const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/experiment`, {
      method: 'POST',
      body: formData,
    });
    const body = await response.json();
    setResponseMessage(body.message);
    setUploading(false);
    setShowToast(true);
    setSelectedFilename("");
    setFileSelected(false);
  };

  const handleFileSelect = (e: any) => {
    e.preventDefault();
    fileSelector.click();
  }

  return (
    <Container>
      <Row>
        <Col>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" onClick={() => { fileSelected && handleUploadClick() }}>
                Upload
              </span>
            </div>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                ref={fileInput}
                onClick={handleFileSelect}
              />
              <label className="custom-file-label">
                {(fileSelected && selectedFilename) || "Select a file to upload"}
              </label>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <ListGroup>
            {hasError && <div>Error encountered while loading experiments.</div>}
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
}

export default Experiment;
