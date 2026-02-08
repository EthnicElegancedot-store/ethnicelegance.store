"use client";
import React, { useState } from "react";

function Banner_08() {
  // State to control banner visibility
  const [isVisible, setIsVisible] = useState(true);

  // Hide banner when user dismisses it
  const dismissBanner = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-primary px-4 py-3 text-primary-foreground shadow-md">
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex flex-1 items-center justify-center text-center sm:justify-start sm:text-left">
          <div className="hidden sm:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-3 h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="flex items-center text-sm font-medium text-primary-foreground">
            <span className="mr-1.5 hidden rounded-full bg-primary-foreground px-2 py-0.5 text-xs font-bold text-primary sm:inline-block">
              NEW
            </span>
            <span>
              <span className="font-bold">Free shipping</span> now available on
              all Summer Edition items!
              <a
                href="#"
                className="ml-1.5 whitespace-nowrap underline hover:text-primary-foreground/80"
              >
                Shop now →
              </a>
            </span>
          </p>
        </div>
        <button
          className="ml-3 flex-shrink-0 text-primary-foreground focus:outline-none"
          onClick={dismissBanner}
          aria-label="Dismiss"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Banner_08;
