import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
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

    fetchStimuliUrls();
  }, []);

  return (
    <Container>
      <Row>
        {hasError && <div>Error encountered while loading images.</div>}
        {stimuliUrls && generateCards(stimuliUrls)}
        {!stimuliUrls.length && <div>No experiment files uploaded.</div>}
      </Row>
    </Container>
  );
};

export default Stimuli;
