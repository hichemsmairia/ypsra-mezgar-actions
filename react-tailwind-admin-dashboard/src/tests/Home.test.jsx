class IntersectionObserver {
  constructor(callback, options) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserver;


import axios from "axios";
vi.mock("axios");

axios.get.mockResolvedValue({
  data: [
    /* your mock tours */
  ],
});

import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Home from "../pages/home/Home"; // adjust path
import * as TourServices from "../services/TourServices";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../redux/store/store";
import * as reactRouter from "react-router";

vi.mock("../services/TourServices", () => ({
  fetchTours: vi.fn(),
}));

describe("Home component", () => {
  beforeEach(() => {
    TourServices.fetchTours.mockResolvedValue([
      {
        id: "1",
        tourName: "Tour Example",
        scenes: [{ textureUrl: "https://example.com/img.jpg" }],
      },
    ]);
  });

  it("renders the tour cards", async () => {
    render(
      <Provider store={store}>
        <reactRouter.MemoryRouter initialEntries={["/"]}>
          <Home />
        </reactRouter.MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Tour Example/i)).toBeInTheDocument();
    });
  });
});
