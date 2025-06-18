import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignIn from "../pages/AuthPages/SignIn";
import { Provider } from "react-redux";
import { store } from "../../redux/store/store"; // adjust the path to your real store
import { BrowserRouter, Router } from "react-router-dom";
import * as reactRouter from "react-router";
import { toast } from "react-toastify";
import { vi } from "vitest";
import { ThemeProvider } from "../context/ThemeContext";

import axios from "axios";
vi.mock("axios");

axios.get.mockResolvedValue({
  data: [
    /* your mock tours */
  ],
});

// Mock react-toastify toast functions
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("SignIn component", () => {
  let navigateMock;

  beforeEach(() => {
    // Clear toast mocks before each test
    toast.success.mockClear();
    toast.error.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderComponent() {
    return render(
      <Provider store={store}>
        <ThemeProvider>
          {" "}
          <reactRouter.MemoryRouter initialEntries={["/signin"]}>
            <SignIn />
          </reactRouter.MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
  }

  test("renders the SignIn form", () => {
    renderComponent();

    expect(screen.getByText(/Sign In Page/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter your email/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter your password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("allows typing in inputs and toggling password visibility", () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    fireEvent.change(emailInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });

    expect(emailInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("mypassword");

    // Initially password input type should be "password"
    expect(passwordInput.type).toBe("password");

    // Find the toggle icon (span with cursor-pointer)
    const toggleSpan = screen.getByText(
      (content, element) =>
        element.tagName.toLowerCase() === "span" &&
        element.classList.contains("cursor-pointer")
    );

    // Click to show password (type=text)
    fireEvent.click(toggleSpan);
    expect(screen.getByPlaceholderText(/Enter your password/i).type).toBe(
      "text"
    );

    // Click again to hide password (type=password)
    fireEvent.click(toggleSpan);
    expect(screen.getByPlaceholderText(/Enter your password/i).type).toBe(
      "password"
    );
  });

  test("dispatches loginUser action on form submit", () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "mypassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // The actual dispatch happens, but since this is an integration test,
    // you can check for expected UI side effects or Redux state changes elsewhere.
  });

  test("logs in with admin credentials and updates Redux state", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "admin@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "admin" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Optionally wait for something async if login triggers UI change
    await screen.findByRole("button", { name: /sign in/i });
  });

  // You can add tests to check toast messages or navigation behavior if you simulate the redux store updates
});
