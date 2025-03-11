import React from 'react'

interface Props {
  onClick: () => void;
}
const ResponsesBtn = ({ onClick }: Props) => {
  return (
    <button onClick={onClick}>Responses</button>
  )
}

export default ResponsesBtn