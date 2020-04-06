import React, { ReactElement } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

interface ExperimentItemProps {
  url: string
}

async function deleteExperimentFile(filename: string) {
  await fetch(`${process.env.REACT_APP_BACKEND_ADDRESS}/experiment/${filename}`, { method: 'delete'});
  window.location.reload(false);
}

function ExperimentItem({ url }: ExperimentItemProps): ReactElement<ExperimentItemProps> {
  const filenameExpression = new RegExp(`${process.env.REACT_APP_BACKEND_ADDRESS}/static/experiment/(.*)`);
  const match = filenameExpression.exec(url);
  const filename = match ? match[1] : 'unknown filename';

  return (
    <ListGroup.Item>
      <p>{filename}</p>
      <Button href={url} className="mr-1">View</Button>
      <Button onClick={() => deleteExperimentFile(filename)}>Delete</Button>
    </ListGroup.Item>
  );
}

export default ExperimentItem;
