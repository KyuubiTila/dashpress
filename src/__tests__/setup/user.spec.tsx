import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import UserSetup from "pages/setup/user";
import userEvent from "@testing-library/user-event";
import { SETUP_CHECK_DATA } from "__tests__/_/api-handlers/setup";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";
import { getToastMessage } from "../_/utils/closeAllToasts";

const server = setupApiHandlers();

describe("pages/setup/user", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  beforeAll(() => {
    localStorage.clear();
  });

  it("should create new user successfully", async () => {
    server.resetHandlers();
    localStorage.clear();
    const replaceMock = jest.fn();

    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        replaceMock,
      })
    );

    SETUP_CHECK_DATA.data = {
      hasUsers: false,
      hasDbCredentials: true,
    };

    render(
      <TestProviders>
        <UserSetup />
      </TestProviders>
    );

    await userEvent.type(
      await screen.findByLabelText("Username"),
      "testusername"
    );
    await userEvent.type(screen.getByLabelText("Name"), "testname");
    await userEvent.type(screen.getByLabelText("Password"), "Some Password");

    await userEvent.click(
      screen.getByRole("button", { name: "Setup Account" })
    );

    expect(await getToastMessage()).toBe("Account Was Successfully Setup");

    await waitFor(() => {
      expect(replaceMock).toHaveBeenLastCalledWith("/", "/", { locale: "en" });
    });
  });
});
