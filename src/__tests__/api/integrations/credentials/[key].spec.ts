import handler from "pages/api/integrations/credentials/[key]";
import revealHandler from "pages/api/integrations/credentials/reveal";
import {
  setupAllTestData,
  createAuthenticatedMocks,
  createAuthenticatedViewerMocks,
  setupRolesTestData,
  createAuthenticatedCustomRoleMocks,
} from "__tests__/api/_test-utils";

const currentState = async () => {
  const { req, res } = createAuthenticatedMocks({
    method: "POST",
    body: {
      password: "password",
    },
  });

  await revealHandler(req, res);

  return res._getJSONData();
};

describe("/api/integrations/credentials/[key]", () => {
  beforeAll(async () => {
    await setupAllTestData(["credentials", "users"]);
  });

  describe("Plain keys", () => {
    it("should create new entry for non-existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "NEW_CREDENTIAL_KEY",
        },
        body: {
          value: "NEW_CREDENTIAL_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CREDENTIAL_KEY_1",
            "value": "CREDENTIAL_VALUE_1",
          },
          {
            "key": "CREDENTIAL_KEY_2",
            "value": "CREDENTIAL_VALUE_2",
          },
          {
            "key": "NEW_CREDENTIAL_KEY",
            "value": "NEW_CREDENTIAL_VALUE",
          },
        ]
      `);
    });

    it("should update value for existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "CREDENTIAL_KEY_2",
        },
        body: {
          value: "UPDATED_CREDENTIAL_VALUE_2",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CREDENTIAL_KEY_1",
            "value": "CREDENTIAL_VALUE_1",
          },
          {
            "key": "CREDENTIAL_KEY_2",
            "value": "UPDATED_CREDENTIAL_VALUE_2",
          },
          {
            "key": "NEW_CREDENTIAL_KEY",
            "value": "NEW_CREDENTIAL_VALUE",
          },
        ]
      `);
    });

    it("should delete key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "CREDENTIAL_KEY_1",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CREDENTIAL_KEY_2",
            "value": "UPDATED_CREDENTIAL_VALUE_2",
          },
          {
            "key": "NEW_CREDENTIAL_KEY",
            "value": "NEW_CREDENTIAL_VALUE",
          },
        ]
      `);
    });
  });

  describe("Group keys", () => {
    it("should not create new entry for non-existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "NEW_CREDENTIAL___KEY",
        },
        body: {
          value: "NEW_CREDENTIL_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Group keys can't be created or updated. They should be updated in the plugin settings",
          "method": "PUT",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);

      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CREDENTIAL_KEY_2",
            "value": "UPDATED_CREDENTIAL_VALUE_2",
          },
          {
            "key": "NEW_CREDENTIAL_KEY",
            "value": "NEW_CREDENTIAL_VALUE",
          },
        ]
      `);
    });

    it("should not update value for existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "DATABASE___dataSourceType",
        },
        body: {
          value: "UPDATED_CONSTANT_KEY_3",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Group keys can't be created or updated. They should be updated in the plugin settings",
          "method": "PUT",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);

      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CREDENTIAL_KEY_2",
            "value": "UPDATED_CREDENTIAL_VALUE_2",
          },
          {
            "key": "NEW_CREDENTIAL_KEY",
            "value": "NEW_CREDENTIAL_VALUE",
          },
        ]
      `);
    });

    it("should not delete key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "DATABASE___dataSourceType",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Group keys can't be deleted. They will be removed when the plugin is removed",
          "method": "DELETE",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);

      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CREDENTIAL_KEY_2",
            "value": "UPDATED_CREDENTIAL_VALUE_2",
          },
          {
            "key": "NEW_CREDENTIAL_KEY",
            "value": "NEW_CREDENTIAL_VALUE",
          },
        ]
      `);
    });
  });

  describe("permission", () => {
    it("should return 401 when user has incorrect permission", async () => {
      await setupRolesTestData([
        {
          id: "custom-role",
          permissions: ["CAN_CONFIGURE_APP"],
        },
      ]);
      const { req, res } = createAuthenticatedViewerMocks({
        method: "PUT",
        query: {
          key: "NEW_CREDENTIAL_KEY",
        },
        body: {
          value: "NEW_CREDENTIAL_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(401);
    });
    it("should work when user has correct permission", async () => {
      await setupRolesTestData([
        {
          id: "custom-role",
          permissions: ["CAN_MANAGE_INTEGRATIONS"],
        },
      ]);

      const { req, res } = createAuthenticatedCustomRoleMocks({
        method: "PUT",
        query: {
          key: "NEW_CREDENTIAL_KEY",
        },
        body: {
          value: "NEW_CREDENTIAL_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
    });
  });
});