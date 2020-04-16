import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import StimuliCard from './stimuliCard';

const generateCards = (stimuliUrls: Array<string>): Array<JSX.Element> => {
  const cards: Array<JSX.Element> = [];
  stimuliUrls.forEach(url => {
    cards.push(<StimuliCard url={url} key={url} />);
  });

  return cards;
};

const DEFAULT_FILE_INPUT_TEXT = 'Select a file to upload';

const Stimuli: React.FC = () => {
  const [hasError, setErrors] = useState(false);
  const [stimuliUrls, setStimuliUrls] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [file, setFile] = useState<string | Blob>('');
  const [fileInputText, setFileInputText] = useState(DEFAULT_FILE_INPUT_TEXT);

  useEffect(() => {
    async function fetchStimuliUrls(): Promise<void> {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/image`
        );
        const body = await response.json();
        setStimuliUrls(body.files);
      } catch (err) {
        setErrors(err);
      }
    }

    if (!isUploading) fetchStimuliUrls();
  }, [isUploading, file]);

  const fileChangedHandler = (event: any) => {
    setFileInputText(event.target.files[0].name);
    setFile(event.target.files[0]);
  };

  const handleUploadClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      setUploading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/image`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const body = await response.json();
      setResponseMessage(body.message);
      setUploading(false);
      setFile('');
      setFileInputText(DEFAULT_FILE_INPUT_TEXT);
      setShowToast(true);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={handleUploadClick}>
            <div className="input-group">
              <div className="input-group-prepend">
                <Button
                  variant="secondary"
                  type="submit"
                  disabled={file === '' || isUploading}
                >
                  {isUploading ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    'Upload Image'
                  )}
                </Button>
              </div>
              <div className="custom-file">
                <input
                  type="file"
                  onChange={fileChangedHandler}
                  aria-describedby="inputGroupFileAddon01"
                  accept="image/*"
                  className="custom-file-input"
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  {fileInputText}
                </label>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
      <Row className="content">
        {hasError && <div>Error encountered while loading images.</div>}
        {stimuliUrls && generateCards(stimuliUrls)}
      </Row>
      {showToast && (
        <Row>
          <Col>
            <div>
              <Toast
                style={{
                  left: '50%',
                  bottom: '0%',
                  position: 'fixed',
                  zIndex: 10,
                  transform: 'translate(-50%, -50%)',
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
