import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UserUpdate from "pages/users/[username]/index";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";
import { getToastMessage } from "@/__tests__/_/utils/closeAllToasts";

setupApiHandlers();

describe("pages/users/[username]/index", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  describe("Update Profile", () => {
    it("should disable role for current user", async () => {
      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          query: {
            username: "root",
          },
        })
      );

      render(
        <TestProviders>
          <UserUpdate />
        </TestProviders>
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Role")).toBeDisabled();
      });
      expect(screen.getByLabelText("Name")).not.toBeDisabled();
    });

    it("should show user details", async () => {
      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          query: {
            username: "foo",
          },
        })
      );

      render(
        <TestProviders>
          <UserUpdate />
        </TestProviders>
      );

      await waitFor(() => {
        expect(screen.getByLabelText("Name")).toHaveValue("Some Name");
      });

      expect(
        screen.getByRole("listbox", {
          name: "Role",
        })
      ).toHaveValue("Viewer");
    });

    it("should update user details", async () => {
      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          query: {
            username: "foo",
          },
        })
      );
      render(
        <TestProviders>
          <UserUpdate />
        </TestProviders>
      );

      await userEvent.clear(await screen.findByLabelText("Name"));
      await userEvent.type(screen.getByLabelText("Name"), "Updated Name");

      await userEvent.type(screen.getByLabelText("Role"), "Creator");
      await userEvent.keyboard("{Enter}");

      await userEvent.click(
        screen.getByRole("button", { name: "Update User" })
      );

      expect(await getToastMessage()).toBe("User Updated Successfully");
    });

    it("should show updated user details", async () => {
      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          query: {
            username: "foo",
          },
        })
      );

      render(
        <TestProviders>
          <UserUpdate />
        </TestProviders>
      );

      await waitFor(() => {
        expect(screen.getByLabelText("Name")).toHaveValue("Updated Name");
      });
      expect(
        screen.getByRole("combobox", {
          name: "Role",
        })
      ).toHaveTextContent("Creator");
    });
  });

  describe("Reset Password", () => {
    it("should be hidden for current user", async () => {
      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          query: {
            username: "root",
          },
        })
      );
      render(
        <TestProviders>
          <UserUpdate />
        </TestProviders>
      );

      await waitFor(() => {
        expect(screen.getByLabelText("Role")).toBeInTheDocument();
      });

      expect(
        screen.queryByRole("heading", { name: "Reset User Password" })
      ).not.toBeInTheDocument();
    });

    it("should reset password", async () => {
      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          query: {
            username: "foo",
          },
        })
      );
      render(
        <TestProviders>
          <UserUpdate />
        </TestProviders>
      );

      await userEvent.type(screen.getByLabelText("Password"), "password");

      await userEvent.click(
        screen.getByRole("button", { name: "Reset Password" })
      );

      expect(
        await screen.findByText("Password Reset Successfully")
      ).toBeInTheDocument();
    });
  });
});
