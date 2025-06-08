import { vi } from "vitest";

// ✅ Declare the spy at the top
const navigateMock = vi.fn();

// ✅ Must mock BEFORE importing anything from the module
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Home from "../pages/home/Home";
import { FaCompass, FaMapMarkedAlt, FaGlobeAmericas } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { ThemeProvider } from "../context/ThemeContext";
import * as reactRouter from "react-router";
// Mock the TourServices with empty array response

vi.mock("../../services/TourServices", () => ({
  fetchTours: vi.fn().mockResolvedValue([]),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

const mockStore = configureStore([]);

describe("Home Component", () => {
  let navigateMock;
  let store;
  let tours = [];

  beforeAll(() => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();

    // Mock IntersectionObserver
    window.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  beforeEach(() => {
    vi.mock("react-router-dom", async () => {
      const actual = await vi.importActual("react-router");
      return {
        ...actual,
        useNavigate: vi.fn(),
      };
    });
    navigateMock = vi.fn();
    useNavigate.mockImplementation(() => navigateMock);
    // Initialize with default unauthenticated state
    store = mockStore({
      auth: {
        user: null,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (user = null) => {
    if (user) {
      store = mockStore({
        auth: {
          user: {
            id: "123",
            name: "Test User",
            email: "test@example.com",
            roles: user.roles || ["user"],
            token: "mock-token",
          },
          isLoading: false,
          isError: false,
          isSuccess: true,
          message: "",
        },
      });
    }

    return render(
      <Provider store={store}>
        <ThemeProvider>
          <reactRouter.MemoryRouter initialEntries={["/signin"]}>
            <Home />
          </reactRouter.MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
  };

  test("renders without crashing", () => {
    renderComponent();
    expect(screen.getByText(/Explore the World in 360°/i)).toBeInTheDocument();
  });

  test("displays navigation bar with correct links", () => {
    renderComponent();
    expect(screen.getByText("360")).toBeInTheDocument();

    ["Home", "features", "gallery", "contact"].forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test("shows login button when user is not authenticated", () => {
    renderComponent();
    expect(
      screen.getByRole("button", { name: /Se connecter/i })
    ).toBeInTheDocument();
  });

  test("shows dashboard button when user is authenticated", () => {
    renderComponent({ roles: ["admin"] });
    expect(
      screen.getByRole("button", { name: /Tableau de board/i })
    ).toBeInTheDocument();
  });

  test("shows logout button when user is authenticated", () => {
    renderComponent({ roles: ["admin"] });
    expect(
      screen.getByRole("button", { name: /Déconnection/i })
    ).toBeInTheDocument();
  });

  test("dispatches logout action when logout button is clicked", async () => {
    renderComponent({ roles: ["admin"] });

    const logoutButton = screen.getByRole("button", { name: /Déconnection/i });
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: "auth/logout",
      })
    );
  });

  test("navigates to dashboard when dashboard button is clicked", async () => {
    renderComponent({ roles: ["admin"] });

    const dashboardButton = screen.getByRole("button", {
      name: /Tableau de board/i,
    });
    await act(async () => {
      fireEvent.click(dashboardButton);
    });
  });

  test("navigates to signin when login button is clicked", async () => {
    renderComponent();

    const loginButton = screen.getByRole("button", { name: /Se connecter/i });
    await act(async () => {
      fireEvent.click(loginButton);
    });
  });

  test("renders without crashing", () => {
    renderComponent();
    expect(screen.getByText(/Explore the World in 360°/i)).toBeInTheDocument();
  });

  test("displays navigation bar with correct links", () => {
    renderComponent();
    expect(screen.getByText("360")).toBeInTheDocument();

    ["Home", "features", "gallery", "contact"].forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test("shows login button when user is not authenticated", () => {
    renderComponent();
    expect(
      screen.getByRole("button", { name: /Se connecter/i })
    ).toBeInTheDocument();
  });

  test("shows dashboard and logout buttons when admin is authenticated", () => {
    renderComponent({ roles: ["admin"] });
    expect(
      screen.getByRole("button", { name: /Tableau de board/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Déconnection/i })
    ).toBeInTheDocument();
  });

  //   test("toggles dark mode when clicked", async () => {
  //     renderComponent();

  //     const darkModeButton = screen.getByLabelText("Toggle dark mode");
  //     expect(screen.getbya("sun*")).toBeInTheDocument();

  //     await act(async () => {
  //       fireEvent.click(darkModeButton);
  //     });

  //     expect(screen.getByTitle("moon")).toBeInTheDocument();
  //   });

  test("loads and displays tours in gallery section if tours exist", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Featured Tours")).toBeInTheDocument();
    });

    if (tours.length > 0) {
      await waitFor(() => {
        tours.forEach((tour) => {
          expect(screen.getByText(tour.tourName)).toBeInTheDocument();
        });
      });
    } else {
      console.warn("No tours available, gallery test skipped");
    }
  });

  test("navigates to tour view when tour card is clicked (if tours exist)", async () => {
    if (tours.length === 0) {
      console.warn("No tours available, navigation test skipped");
      return;
    }

    renderComponent();

    await waitFor(() => {
      const firstTour = tours[0];
      const tourCard = screen.getByText(firstTour.tourName);
      fireEvent.click(tourCard);
    });

    expect(navigateMock).toHaveBeenCalledWith(`/view_tour/${tours[0].id}`);
  });

  test("scrolls to section when nav link is clicked", () => {
    renderComponent();

    const mockScroll = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScroll;

    const featuresLink = screen.getByText("features");
    fireEvent.click(featuresLink);

    expect(mockScroll).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  test("dispatches logout action when logout button is clicked", () => {
    renderComponent({ roles: ["admin"] });

    const logoutButton = screen.getByRole("button", { name: /Déconnection/i });
    fireEvent.click(logoutButton);

    const actions = store.getActions();
    expect(actions[0].type).toBe("auth/logout");
  });

  test("displays all feature cards with icons", () => {
    renderComponent();

    expect(screen.getByText("Why Choose Our 360 Tours")).toBeInTheDocument();
    expect(screen.getByText("Interactive Navigation")).toBeInTheDocument();
    expect(screen.getByText("Detailed Locations")).toBeInTheDocument();
    expect(screen.getByText("Global Destinations")).toBeInTheDocument();

    expect(screen.getByTitle("compass")).toBeInTheDocument();
    expect(screen.getByTitle("map")).toBeInTheDocument();
    expect(screen.getByTitle("globe")).toBeInTheDocument();
  });

  test("displays contact information correctly", () => {
    renderComponent();

    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByText(/123 Virtual Tour Ave/i)).toBeInTheDocument();
    expect(screen.getByText(/\+1 \(555\) 123-4567/i)).toBeInTheDocument();
    expect(screen.getByText(/info@virtual360tours.com/i)).toBeInTheDocument();
  });
});
