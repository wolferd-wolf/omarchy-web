"use client";

import React from "react";
import { useSystemStore } from "@/store/systemStore";

export const ScreenshotOverlay: React.FC = () => {
  const { isTakingScreenshot } = useSystemStore();

  if (!isTakingScreenshot) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none bg-white animate-shutter-flash" />
  );
};
