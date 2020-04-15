import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Experiment from './Experiment';

const generateItems = (experimentUrls: Array<string>) => {
  const items: Array<JSX.Element> = [];
  experimentUrls.forEach(url => {
    items.push(<Experiment url={url} key={url} />);
  });

  return items;
};

const onFileSelect = async (e: any) => {
  Experiment.setSelectedFile({ file: e.target.files[0] });
};

const ExperimentRunner: React.FC = () => {
  return (
    <Container>
      <h1>Please select Experiment to run:</h1>
    </Container>
  );
};

export default ExperimentRunner;
