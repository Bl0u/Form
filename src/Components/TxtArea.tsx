import React from 'react';

interface Props {
  handleClick: () => void; // No params needed here
}

function TxtArea({ handleClick }: Props) {
  return <button onClick={handleClick}>Add Text Area</button>;
}

export default TxtArea;