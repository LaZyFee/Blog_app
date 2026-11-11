import mongoose from "mongoose";

export const parsePagination = (query, { defaultLimit = 10, maxLimit = 50 } = {}) => {
  const rawPage = query.page ?? "1";
  const rawLimit = query.limit ?? String(defaultLimit);
  if (!/^\d+$/.test(String(rawPage)) || !/^\d+$/.test(String(rawLimit))) {
    return { error: "page and limit must be positive integers" };
  }
  const page = Number(rawPage);
  const limit = Number(rawLimit);
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > maxLimit) {
    return { error: `page must be positive and limit must be between 1 and ${maxLimit}` };
  }
  return { page, limit, skip: (page - 1) * limit };
};

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const validateText = (value, { field, maxLength }) => {
  if (typeof value !== "string") return `${field} must be a string`;
  const trimmed = value.trim();
  if (!trimmed) return `${field} is required`;
  if (trimmed.length > maxLength) return `${field} must be at most ${maxLength} characters`;
  return null;
};
