import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import HomeAdmin from "../pages/Dashboard/HomeAdmin";
import * as visitServices from "../services/visitServices";

// 1. Mock child components
vi.mock("../../components/visiteAdmin/MonthlySalesChart", () => ({
  default: () => <div data-testid="monthly-sales-chart" />,
}));

vi.mock("../../components/visiteAdmin/UserTypePieChart", () => ({
  default: () => <div data-testid="user-type-pie-chart" />,
}));

vi.mock("../../components/visiteAdmin/MonthlyRegistrationsChart", () => ({
  default: ({ visitsData }) => (
    <div data-testid="monthly-visit-chart">{visitsData?.length}</div>
  ),
}));

vi.mock("../../components/visiteAdmin/DemographicCard", () => ({
  default: () => <div data-testid="demographic-card" />,
}));

vi.mock("../../components/common/PageMeta", () => {
  const React = require("react");
  const { Helmet } = require("react-helmet-async");
  return {
    default: () => (
      <>
        <Helmet>
          <title>Test Title</title>
        </Helmet>
        <div data-testid="page-meta" />
      </>
    ),
  };
});

// 2. Mock visit service API
vi.spyOn(visitServices, "getMonthlyVisitorsService").mockResolvedValue({
  month: "June",
  visits: 200,
});

// 3. Fake auth reducer (you can replace with your real one)
const authReducer = (
  state = {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJleHAiOjE3NDkzODQxNDR9.GWWn-oI5X2--I2C3A2POrRmPEItzyGNZbwGqauS-Qlg",
  },
  action
) => state;

// 4. Custom render with mock Redux store
function renderWithRedux(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState,
    }),
  } = {}
) {
  return render(
    <Provider store={store}>
      <HelmetProvider>{ui}</HelmetProvider>
    </Provider>
  );
}

// 5. Test case
describe("HomeAdmin (with Redux token)", () => {
  it("renders all components and fetches visit data", async () => {
    renderWithRedux(<HomeAdmin />, {
      preloadedState: {
        auth: {
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJleHAiOjE3NDkzODQxNDR9.GWWn-oI5X2--I2C3A2POrRmPEItzyGNZbwGqauS-Qlg",
        },
      },
    });

    // Static components
    // expect(
    //   screen.getAllByText("Chargement du graphique...")
    // ).toBeInTheDocument();
    // expect(
    //   screen.getByTestId("Chargement de la carte des visites...")
    // ).toBeInTheDocument();

    // expect(screen.getByTestId("page-meta")).toBeInTheDocument();

    // Async fetch component (AdminMonthlyVisitChart)
    await waitFor(() => {
      expect(screen.getByTestId("monthly-visit-chart")).toHaveTextContent("1");
    });
  });
});
