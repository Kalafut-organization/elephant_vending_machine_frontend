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

const Stimuli: React.FC = () => {
  const [hasError, setErrors] = useState(false);
  const [stimuliUrls, setStimuliUrls] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState({ file: null });

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
  }, [isUploading, selectedFile]);

  const fileChangedHandler = (event: any) => {
    setSelectedFile({ file: event.target.files[0] });
  };

  const handleUploadClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && selectedFile.file) {
      const formData = new FormData();
      formData.append('file', (selectedFile.file as unknown) as File);
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
      setSelectedFile({ file: null });
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
                  disabled={selectedFile.file === null || isUploading}
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
                    'Upload'
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
                  {selectedFile.file !== null
                    ? ((selectedFile.file as unknown) as File).name
                    : 'Select a file to upload'}
                </label>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
      <Row className="content">
        {hasError && <div>Error encountered while loading images.</div>}
        {!stimuliUrls.length && !hasError && (
          <div>No experiment files uploaded.</div>
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
