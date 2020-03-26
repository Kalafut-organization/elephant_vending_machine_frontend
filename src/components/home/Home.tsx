import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const Home: React.FC = () => {
  return (
    <Container>
      <Row>
        <Col>
          <Button variant="secondary" className="my-3" block>
            Run Experiment
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="secondary" className="my-3" block>
            Manage Logs
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="secondary" className="my-3" block>
            Manage Experiments
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="secondary" className="my-3" href="/stimuli" block>
            Manage Stimuli
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
