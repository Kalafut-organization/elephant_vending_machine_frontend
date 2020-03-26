import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import './App.css';

const Home = lazy(() => import('../home/Home'));
const Stimuli = lazy(() => import('../stimuli/Stimuli'));

const App: React.FC = () => {
  return (
    <Container fluid>
      <Navbar bg="primary" variant="dark" className="mb-3">
        <Navbar.Brand href="/">Elephant Vending Machine</Navbar.Brand>
      </Navbar>
      <Row>
        <Col>
          <Router>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/stimuli" component={Stimuli} />
              </Switch>
            </Suspense>
          </Router>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
