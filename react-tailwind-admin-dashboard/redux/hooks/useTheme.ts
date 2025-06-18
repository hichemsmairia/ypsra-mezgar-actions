"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, initializeTheme } from "../slices/themeSlice";

export const useTheme = () => {
  const dispatch = useDispatch();
  const { theme, isInitialized } = useSelector((state: any) => state.theme);

  // Initialize theme on mount
  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeTheme());
    }
  }, [dispatch, isInitialized]);

  // Watch for theme changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, isInitialized]);

  return {
    theme,
    toggleTheme: () => dispatch(toggleTheme()),
  };
};
