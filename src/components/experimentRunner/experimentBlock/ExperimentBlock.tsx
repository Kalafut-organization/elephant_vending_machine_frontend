import React, { ReactElement } from 'react';
import Form from 'react-bootstrap/Form';

interface ExperimentBlockProps {
  url: string;
}

const ExperimentBlock = ({
  url,
}: ExperimentBlockProps): ReactElement<ExperimentBlockProps> => {
  const filenameExpression = new RegExp(
    `${process.env.REACT_APP_BACKEND_ADDRESS}/static/experiment/(.*)`
  );
  const match = filenameExpression.exec(url);
  const filename = match ? match[1] : 'unknown filename';

  return <option>{filename}</option>;
};

export default ExperimentBlock;
