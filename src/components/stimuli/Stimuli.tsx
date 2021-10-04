import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StimuliCard from './stimuliCard';

const generateCards = (stimuliUrls: Array<string>): Array<JSX.Element> => {
  const cards: Array<JSX.Element> = [];
  stimuliUrls.forEach(url => {
    cards.push(<StimuliCard url={url} key={url} />);
  });

  return cards;
};

const Stimuli: React.FC = props => {
  const [hasError, setErrors] = useState(false);
  const [stimuliUrls, setStimuliUrls] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState({ file: null });
  const name = useParams();

  useEffect(() => {
    async function fetchStimuliUrls(): Promise<void> {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/${(name as any).name}`
        );
        const body = await response.json();
        setStimuliUrls(body.files);
      } catch (err) {
        setErrors(err);
      }
    }

    if (!isUploading) fetchStimuliUrls();
  }, [isUploading]);

  const onFileSelect = (event: any) => {
    setSelectedFile({ file: event.target.files[0] });
  };

  const handleUploadClick = async () => {
    const formData = new FormData();
    if (selectedFile && selectedFile.file) {
      formData.append('file', (selectedFile.file as unknown) as File);
    }
    setUploading(true);
    console.log(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/${(name as any).name}/image`
    );
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/${(name as any).name}/image`,
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
      <Row style={{ marginBottom: '1em' }}>
        <Col>
          <div className="input-group">
            <div className="input-group-prepend">
              <span
                className="input-group-text"
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
        </Col>
      </Row>
      <Row className="content">
        {hasError && <div>Error encountered while loading images.</div>}
        {!stimuliUrls.length && !hasError && (
          <div>No stimuli files uploaded.</div>
        )}
        {stimuliUrls && generateCards(stimuliUrls)}
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

export default Stimuli;
