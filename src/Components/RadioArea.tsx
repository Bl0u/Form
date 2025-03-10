import React from 'react';

interface Props {
  handleClick: () => void;
}

function Checkbox({ handleClick }: Props) {
  return <button onClick={handleClick}>Add Radio</button>;
}

export default Checkbox;