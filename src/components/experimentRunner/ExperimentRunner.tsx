import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
    fetchExperimentUrls();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Please select a file to run: </h1>
          <ListGroup>
            {hasError && (
              <div>Error encountered while loading experiments.</div>
            )}
            {experimentUrls && generateItems(experimentUrls)}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default ExperimentRunner;
