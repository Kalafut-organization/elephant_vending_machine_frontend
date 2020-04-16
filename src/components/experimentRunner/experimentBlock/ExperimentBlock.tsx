import React, { ReactElement, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Modal, Button } from 'react-bootstrap';

interface ExperimentBlockProps {
  url: string;
}

const ExperimentBlock = ({
  url,
}: ExperimentBlockProps): ReactElement<ExperimentBlockProps> => {
  const [isModalOpen, setModalStatus] = useState(false);
  const filenameExpression = new RegExp(
    `${process.env.REACT_APP_BACKEND_ADDRESS}/static/experiment/(.*)`
  );
  const match = filenameExpression.exec(url);
  const filename = match ? match[1] : 'unknown filename';

  return (
    <ListGroup.Item className="experiment-block">
      <span>{filename}</span>
      <Button variant="primary" style={{ float: 'right' }}>
        Select
      </Button>
    </ListGroup.Item>
  );
};

export default ExperimentBlock;
