// features/theme/themeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  isInitialized: boolean;
}

const initialState: ThemeState = {
  theme: "light",
  isInitialized: false,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    initializeTheme: (state) => {
      state.isInitialized = true;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, setInitialized, initializeTheme } =
  themeSlice.actions;
export default themeSlice.reducer;
