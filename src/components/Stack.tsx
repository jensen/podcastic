import { cloneElement } from "react";

export default function Stack({ children }) {
  return (
    <div className="w-12 h-12 flex-shrink-0 relative">
      {cloneElement(children, {
        ...children.props,
        style: { position: "absolute", filter: "blur(10px)" },
      })}
      {cloneElement(children)}
    </div>
  );
}
