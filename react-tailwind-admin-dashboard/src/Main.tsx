import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/flatpickr.css";

import App from "./App.jsx";
import { AppWrapper } from "./components/common/PageMeta";
import { ThemeProvider } from "./context/ThemeContext";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store/store";
import { PersistGate } from "redux-persist/integration/react";

// Get the root DOM node safely
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <AppWrapper>
              <App />
            </AppWrapper>
          </ThemeProvider>
        </PersistGate>
      </Provider>
   
  );
} else {
  throw new Error("Root element not found");
}
