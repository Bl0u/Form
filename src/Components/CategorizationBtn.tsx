import React from 'react';

interface Props {
  handleClick: () => void;
  handleEnd: () => void;
  isCategorizing: boolean;
}

function CategorizationBtn({ handleClick, handleEnd, isCategorizing }: Props) {
  return (
    <button onClick={isCategorizing ? handleEnd : handleClick}>
      {isCategorizing ? 'End Section' : 'Start Section'}
    </button>
  );
}

export default CategorizationBtn;
