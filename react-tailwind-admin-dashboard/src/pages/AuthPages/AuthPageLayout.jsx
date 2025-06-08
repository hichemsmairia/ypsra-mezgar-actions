import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import { FaCompass } from "react-icons/fa";

export default function AuthLayout({ children }) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="px-12 py-8 mx-auto text-center lg:max-w-2xl lg:px-16 lg:py-24">
            <h1 className="flex items-center text-5xl md:text-6xl font-bold leading-tight">
              <div className="flex">
                <span className="text-white mr-4">
                  Explore the World in 360°{" "}
                  <FaCompass className="inline text-indigo-600 text-6xl animate-spin-fast" />
                </span>{" "}
              </div>
            </h1>
            <p className="text-xl text-white">
              Immersive virtual tours that transport you to the most amazing
              places on Earth.
            </p>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
