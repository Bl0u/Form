import React from 'react';

interface Props {
  handleClick: () => void;
}

function Checkbox({ handleClick }: Props) {
  return <button onClick={handleClick}>Add Checkbox</button>;
}

export default Checkbox;