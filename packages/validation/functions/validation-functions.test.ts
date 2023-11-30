import { expect, test } from "vitest";
import {
  email,
  required,
  regex,
  ipAddress,
  maxLength,
  minLength,
} from "./validation-functions";

test("Required for empty string", () => {
  expect(required()("", "name")).toEqual({
    error: true,
    errorMessage: "Required",
  });
});

test("Required for string with only spaces", () => {
  expect(required()("  ", "secondName")).toEqual({
    error: true,
    errorMessage: "Required",
  });
});

test("Required for numbers", () => {
  expect(required()(41, "age")).toBe(undefined);
});

test("Incorrect email", () => {
  expect(email()("", "email")).toEqual({
    error: true,
    errorMessage: "Invalid email address",
  });
});

test("Correct email", () => {
  expect(email()("askany07@test.io", "email")).toBe(undefined);
});

test("Incorrect regex", () => {
  expect(regex(/^hello/)("bye", "regexField")).toEqual({
    error: true,
    errorMessage: "Field has invalid format",
  });
});

test("Correct regex", () => {
  expect(regex(/^hello/)("hello guest", "regexField")).toBe(undefined);
});

test("Incorrect ip", () => {
  expect(ipAddress()("192.AAA.1.38", "ipAddress")).toEqual({
    error: true,
    errorMessage: "Field has invalid ip address",
  });
});

test("Correct ip", () => {
  expect(ipAddress()("192.123.1.38", "ipAddress")).toBe(undefined);
});

test("Incorrect min length", () => {
  expect(minLength(6)("12345", "minLength")).toEqual({
    error: true,
    errorMessage: "Min length is 6",
  });
});

test("Correct min length", () => {
  expect(minLength(6)("123456", "minLength")).toBe(undefined);
});

test("Incorrect max length", () => {
  expect(maxLength(10)("12345678910", "max length")).toEqual({
    error: true,
    errorMessage: "Max length is 10",
  });
});

test("Correct max length", () => {
  expect(maxLength(10)("1234567891", "maxLength")).toBe(undefined);
});
