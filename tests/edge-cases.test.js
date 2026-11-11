import test from "node:test";
import assert from "node:assert/strict";

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id || "");
const validateComment = (value) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= 2000;

test("ObjectId validation rejects missing and malformed IDs", () => {
  assert.equal(isValidObjectId(""), false);
  assert.equal(isValidObjectId("not-an-id"), false);
  assert.equal(isValidObjectId("507f1f77bcf86cd799439011"), true);
});

test("comment validation rejects empty and oversized submissions", () => {
  assert.equal(validateComment("   "), false);
  assert.equal(validateComment("a".repeat(2001)), false);
  assert.equal(validateComment("valid comment"), true);
});
