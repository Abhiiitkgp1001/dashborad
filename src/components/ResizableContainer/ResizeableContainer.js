import { Resizable } from "re-resizable";
import React, { useState } from "react";

import "./ResizableContainer.css";

function ResizableContainer({ children, width, height }) {
  const [containerWidth, setContainerWidth] = useState(width);
  const [containerHeight, setContainerHeight] = useState(height);

  const onResize = (e, direction, ref, d) => {
    setContainerHeight(containerHeight + d.height);
    setContainerWidth(containerWidth + d.width);
  };

  return (
    <Resizable
      size={{ width: containerWidth, height: containerHeight }}
      // width={containerWidth}
      // height={containerHeight}
      onResizeStop={onResize}
      className="resizable-container"
      minWidth="48vw"
      minHeight="50vh"
      maxWidth="99vw"
      maxHeight="99vh"
    >
      <div className="child-component">{children}</div>
    </Resizable>
  );
}

export default ResizableContainer;
