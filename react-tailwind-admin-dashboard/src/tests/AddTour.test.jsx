import { vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import * as reactRouter from "react-router";

// --- MOCK axios with interceptors and methods ---
const mockAxiosInstance = {
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

vi.mock("axios", () => ({
  create: vi.fn(() => mockAxiosInstance),
}));

vi.mock("../../redux/store/store", () => ({
  store: {
    getState: () => ({
      auth: { token: "mock-token" },
    }),
  },
}));

vi.mock("../services/TourServices", () => ({
  createTour: vi.fn(() => Promise.resolve({ id: "123" })),
  updateTour: vi.fn(() => Promise.resolve()),
}));

vi.mock("../services/SceneServices", () => ({
  uploadScene: vi.fn((file, name) =>
    Promise.resolve({
      id: name,
      textureUrl: URL.createObjectURL(file),
    })
  ),
  saveScenes: vi.fn(() => Promise.resolve([{ id: "scene-1" }])),
}));

vi.mock("../services/PlanServices", () => ({
  uploadPlan: vi.fn(() => Promise.resolve({ id: "plan-1" })),
}));

vi.mock("../services/UserServices", () => ({
  fetchUsers: vi.fn(() => Promise.resolve([{ id: "u1", username: "admin" }])),
}));

vi.mock("../../layout/AdminLayout", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../layout/OwnerLayout", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../components/admin/Maps", () => ({
  __esModule: true,
  default: () => <div>Mocked Map</div>,
}));

vi.mock("../../components/admin/Contact", () => ({
  __esModule: true,
  default: () => <div>Mocked Contact</div>,
}));

vi.mock("../../components/admin/Modal", () => ({
  __esModule: true,
  default: ({ isOpen, onClose, children, title, onSave }) =>
    isOpen ? (
      <div>
        <h2>{title}</h2>
        <button onClick={onSave}>Save</button>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
}));

import * as TourServices from "../services/TourServices";
import AddTour from "../pages/toursManagement/AddTour";
import configureStore from "redux-mock-store"; // if you need it
import { ThemeProvider } from "../context/ThemeContext";

const mockStore = configureStore([]);
const store = mockStore({
  auth: {
    user: {
      roles: ["ADMIN"],
    },
    token: "mock-token",
  },
});

describe("AddTour Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockAxiosInstance.get.mockResolvedValue({ data: [] });
    mockAxiosInstance.post.mockResolvedValue({ data: { id: "123" } });
  });

  test("renders AddTour component and creates a tour", async () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          {" "}
          <reactRouter.MemoryRouter initialEntries={["/"]}>
            <AddTour />
          </reactRouter.MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    const input = screen.getByPlaceholderText("Nom du Tour");
    fireEvent.change(input, { target: { value: "My Test Tour" } });

    const createButton = screen.getByText("Créer Tour");
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText("Tour créé avec succès !")).toBeInTheDocument();
    });
  });

  test("displays error message if no tour name is provided", () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          {" "}
          <reactRouter.MemoryRouter initialEntries={["/"]}>
            <AddTour />
          </reactRouter.MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    const createButton = screen.getByText("Créer Tour");
    fireEvent.click(createButton);

    expect(
      screen.getByText("Veuillez entrer un nom pour le tour.")
    ).toBeInTheDocument();
  });
});
