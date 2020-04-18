import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import LogItem from './LogItem';

const generateItems = (logUrls: Array<string>) => {
  const items: Array<JSX.Element> = [];
  logUrls.forEach(url => {
    items.push(<LogItem url={url} key={url} />);
  });

  return items;
};

const Logs: React.FC = () => {
  const [hasError, setErrors] = useState(false);
  const [logUrls, setLogUrls] = useState([]);

  useEffect(() => {
    async function fetchLogUrls(): Promise<void> {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/log`
        );
        const body = await response.json();
        setLogUrls(body.files);
      } catch (err) {
        setErrors(err);
      }
    }

    fetchLogUrls();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <ListGroup>
            {hasError && (
              <div>Error encountered while loading experiments.</div>
            )}
            {logUrls && generateItems(logUrls)}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Logs;
