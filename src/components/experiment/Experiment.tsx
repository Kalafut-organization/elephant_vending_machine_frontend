import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ExperimentItem from './ExperimentItem';

function generateItems(experimentUrls: Array<string>) {
    const items: Array<JSX.Element> = [];
    experimentUrls.forEach(url => {
        items.push(<ExperimentItem url={url} key={url} />);
    });

    return items;
}

function Experiment() {
    const [hasError, setErrors] = useState(false);
    const [experimentUrls, setExperimentUrls] = useState([]);

    async function fetchExperimentUrls() {
        try {
            console.log('Attempted to fetch experiments.')
            const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/experiment`);
            const body = await response.json();
            setExperimentUrls(body.files);
        } catch (err) {
            setErrors(err);
        }
    }

    useEffect(() => {
        fetchExperimentUrls();
    }, []);

    return (
        <ListGroup>
            {hasError && <div>Error encountered while loading experiments.</div>}
            {experimentUrls && generateItems(experimentUrls)}
        </ListGroup>
    );
}

export default Experiment;
