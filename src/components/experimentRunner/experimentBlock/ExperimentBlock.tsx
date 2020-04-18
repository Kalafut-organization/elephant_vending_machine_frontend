import React, { ReactElement, useState } from 'react';
import Button from 'react-bootstrap/Button';

interface ExperimentBlockProps {
  url: string;
}

const ExperimentBlock = ({
  url,
}: ExperimentBlockProps): ReactElement<ExperimentBlockProps> => {
  const filenameExpression = new RegExp(
    `${process.env.REACT_APP_BACKEND_ADDRESS}/static/experiment/(.*)`
  );
  const [selectedFile, setSelectedFile] = useState({ file: null });
  const match = filenameExpression.exec(url);
  const filename = match ? match[1] : 'unknown filename';

  function handleClick(e: any) {
    setSelectedFile(selectedFile);
  }

  return (
    <Button
      variant="outline-secondary"
      onClick={() => handleClick(selectedFile)}
    >
      {filename}
    </Button>
  );
};

export default ExperimentBlock;
