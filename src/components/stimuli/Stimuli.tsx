import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import StimuliCard from './stimuliCard';

const generateCards = (stimuliUrls: Array<string>): Array<JSX.Element> => {
  const cards: Array<JSX.Element> = [];
  stimuliUrls.forEach(url => {
    cards.push(<StimuliCard url={url} key={url} />);
  });

  return cards;
};

const buildFileSelector = (): HTMLInputElement => {
  const fileSelector: HTMLInputElement = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('accept', 'image/*');
  fileSelector.setAttribute('multiple', 'single');

  return fileSelector;
};

const Stimuli: React.FC = () => {
  const [hasError, setErrors] = useState(false);
  const [stimuliUrls, setStimuliUrls] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
  }, [isUploading]);

  const onFileSelect = (e: any) => {
    const file: File = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/image`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(() => {
        setUploading(false);
        setShowToast(true);
      });
  };

  const fileSelector: HTMLInputElement = buildFileSelector();
  fileSelector.onchange = onFileSelect;

  const handleUploadClick = (e: any) => {
    e.preventDefault();
    fileSelector.click();
  };

  return (
    <Container>
      <Row>
        {showToast ? (
          <div
            style={{
              position: 'absolute',
              zIndex: 3,
            }}
          >
            <Toast
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={3000}
              autohide
            >
              <Toast.Body>Image Upload Successful</Toast.Body>
            </Toast>
          </div>
        ) : null}
        <Col>
          <Button
            variant="secondary"
            size="lg"
            className="my-3"
            onClick={handleUploadClick}
            block
          >
            {isUploading ? (
              <Spinner
                as="span"
                animation="border"
                role="status"
                aria-hidden="true"
              />
            ) : (
              'Upload New Image'
            )}
          </Button>
        </Col>
      </Row>
      <Row>
        {hasError && <div>Error encountered while loading images.</div>}
        {stimuliUrls && generateCards(stimuliUrls)}
      </Row>
    </Container>
  );
};

export default Stimuli;
