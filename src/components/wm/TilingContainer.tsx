"use client";

import React from "react";
import { TilingNode, WindowInstance } from "@/types/os";
import { WindowFrame } from "./WindowFrame";
import { AppRenderer } from "./AppRenderer";

interface TilingContainerProps {
  node: TilingNode | null;
  windows: Record<string, WindowInstance>;
}

export const TilingContainer: React.FC<TilingContainerProps> = ({ node, windows }) => {
  if (!node) return null;

  if (node.type === "window") {
    const win = windows[node.id];
    if (!win || win.isFloating) return null;

    return (
      <div className="w-full h-full min-w-0 min-h-0 flex-1">
        <WindowFrame window={win}>
          <AppRenderer window={win} />
        </WindowFrame>
      </div>
    );
  }

  const isRow = node.direction === "horizontal";

  return (
    <div
      className={`w-full h-full min-w-0 min-h-0 flex ${
        isRow ? "flex-row space-x-2" : "flex-col space-y-2"
      }`}
      style={{ flex: node.flex || 1 }}
    >
      {node.children.map((child, index) => (
        <React.Fragment key={child.id || index}>
          <TilingContainer node={child} windows={windows} />
        </React.Fragment>
      ))}
    </div>
  );
};
