import { useEffect, useRef, useState } from "preact/hooks";

function HeaderBarModal() {
  const [state, setState] = useState(0)

  return (
    <button onClick={() => setState(c => c + 1)}>count: {state}</button>
  )
}

export default HeaderBarModal