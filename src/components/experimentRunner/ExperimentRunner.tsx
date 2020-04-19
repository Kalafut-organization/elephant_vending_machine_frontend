import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
  const [loading, setLoading] = React.useState(true);
  const [experimentUrls, setExperimentUrls] = useState([]);
  const [isRunning, setRunExp] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState('');

  useEffect(() => {
    async function fetchExperimentUrls(): Promise<void> {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/experiment`
        );
        const body = await response.json();
        setExperimentUrls(body.files);
        setLoading(false);
      } catch (err) {
        setErrors(err);
      }
    }

    fetchExperimentUrls();
  }, []);

  const handleRunClick = async () => {
    const formData = new FormData();
    console.log(selectedFile);
    if (selectedFile) {
      formData.append('file', (selectedFile.valueOf as unknown) as File);
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
    setSelectedFile('');
  };

  return (
    <Container>
      <h1>Run Experiments</h1>
      <Form>
        <Form.Group controlId="exampleForm.SelectCustom">
          <Form.Label>Select File:</Form.Label>
          <Form.Control
            as="select"
            custom
            disabled={loading}
            onChange={e => setSelectedFile(e.currentTarget.value)}
          >
            {experimentUrls && generateItems(experimentUrls)}
          </Form.Control>
        </Form.Group>
      </Form>
      <div>
        <Button
          variant="secondary"
          disabled={loading}
          onClick={() => {
            !loading && handleRunClick();
          }}
        >
          Run
        </Button>
      </div>
    </Container>
  );
};

export default ExperimentRunner;
