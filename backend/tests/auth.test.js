const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const { auth, requireAdmin } = require("../middleware/auth");

const secret = "unit-test-secret";

function responseRecorder() {
  return {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test("auth rejects requests without a session token", () => {
  const req = { headers: {}, cookies: {} };
  const res = responseRecorder();
  let nextCalled = false;
  auth(req, res, () => { nextCalled = true; });
  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("auth rejects invalid bearer tokens", () => {
  const req = { headers: { authorization: "Bearer invalid" }, cookies: {} };
  const res = responseRecorder();
  auth(req, res, () => assert.fail("next must not be called"));
  assert.equal(res.statusCode, 401);
});

test("auth attaches the verified user from an http-only cookie", () => {
  const token = jwt.sign({ _id: "user-123", role: "User" }, secret);
  const originalSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = secret;
  try {
    const req = { headers: {}, cookies: { token } };
    const res = responseRecorder();
    let nextCalled = false;
    auth(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(req.user._id, "user-123");
  } finally {
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});

test("admin guard rejects regular users", () => {
  const req = { user: { role: "User" } };
  const res = responseRecorder();
  requireAdmin(req, res, () => assert.fail("next must not be called"));
  assert.equal(res.statusCode, 403);
});

test("admin guard allows administrators", () => {
  const req = { user: { role: "Admin" } };
  const res = responseRecorder();
  let nextCalled = false;
  requireAdmin(req, res, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
});
