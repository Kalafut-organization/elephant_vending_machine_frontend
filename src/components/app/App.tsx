import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { HouseDoorFill } from 'react-bootstrap-icons';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import './App.css';

/* istanbul ignore next */
export const Home = lazy(() => import('../home/Home'));
/* istanbul ignore next */
export const Stimuli = lazy(() => import('../stimuli/Stimuli'));
/* istanbul ignore next */
export const Groups = lazy(() => import('../stimuli/groups/Groups'));
/* istanbul ignore next */
export const Experiment = lazy(() => import('../experiment/Experiment'));
/* istanbul ignore next */
export const ExperimentRunner = lazy(() =>
  import('../experimentRunner/ExperimentRunner')
);
/* istanbul ignore next */
export const Logs = lazy(() => import('../logs/Logs'));
/* istanbul ignore next */
export const NotFound = lazy(() => import('../notFound/NotFound'));

const App: React.FC = () => {
  return (
    <Container fluid>
      <Navbar bg="primary" variant="dark" className="mb-3">
        <a id="home-icon-link" href="/">
          <HouseDoorFill color="white" size={25} className="mr-3" />
        </a>
        <Navbar.Brand href="/">Elephant Vending Machine</Navbar.Brand>
      </Navbar>
      <Row>
        <Col>
          <Router>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/:name/stimuli" component={Stimuli} />
                <Route path="/experiment" component={Experiment} />
                <Route path="/experimentRunner" component={ExperimentRunner} />
                <Route path="/logs" component={Logs} />
                <Route path="/groups" component={Groups} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </Router>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
