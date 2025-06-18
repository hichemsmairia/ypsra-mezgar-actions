"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeTheme } from "./slices/themeSlice";

export default function ThemeInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    dispatch(initializeTheme(savedTheme || "light"));
  }, [dispatch]);

  return null;
}
