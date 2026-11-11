import test from "node:test";
import assert from "node:assert/strict";

import AuthMiddleware from "../src/middlewares/AuthMiddleware.js";
import { generateToken } from "../src/utilities/generateToken.js";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

test("AuthMiddleware rejects missing token", () => {
  let statusCode = 0;
  let responseBody = null;
  let nextCalled = false;

  const req = { headers: {}, cookies: {} };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      responseBody = body;
      return this;
    },
  };

  AuthMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(statusCode, 401);
  assert.equal(responseBody.message, "Token not provided");
  assert.equal(nextCalled, false);
});

test("AuthMiddleware accepts a valid bearer token", () => {
  let nextCalled = false;
  const token = generateToken({ _id: "67d3d2d4e2a3ea6f12345678", email: "user@example.com" });

  const req = {
    headers: {
      authorization: `Bearer ${token}`,
    },
    cookies: {},
  };

  const res = {
    status(code) {
      this.code = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  AuthMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.headers.user_id, "67d3d2d4e2a3ea6f12345678");
  assert.equal(req.headers.email, "user@example.com");
});
