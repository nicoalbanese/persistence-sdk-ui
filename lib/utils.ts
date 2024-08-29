import { customAlphabet } from "nanoid";
export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");
export const timestamps: { createdAt: true; updatedAt: true } = {
  createdAt: true,
  updatedAt: true,
};

