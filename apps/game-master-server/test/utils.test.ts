import { describe, expect, it } from "vitest";
import { itemOrArrayToArray } from "~/utils";

// Describe the suite of tests for the utility function
describe("itemOrArrayToArray", () => {
	// Test for undefined input
	it("should return an empty array when input is undefined", () => {
		const result = itemOrArrayToArray(undefined);
		expect(result).toEqual([]);
	});

	// Test for a single item
	it("should return an array with one element when input is a single item", () => {
		const result = itemOrArrayToArray("hello");
		expect(result).toEqual(["hello"]);
	});

	// Test for an array with one item
	it("should return the same array when input is an array with one element", () => {
		const input = ["hello"];
		const result = itemOrArrayToArray(input);
		expect(result).toEqual(input);
	});

	// Test for an array with multiple items
	it("should return the same array when input is an array with multiple elements", () => {
		const input = ["hello", "world"];
		const result = itemOrArrayToArray(input);
		expect(result).toEqual(input);
	});

	// Test for numeric input
	it("should work with numeric input", () => {
		const result = itemOrArrayToArray(42);
		expect(result).toEqual([42]);
	});

	// Test for an array of numbers
	it("should work with an array of numbers", () => {
		const input = [1, 2, 3];
		const result = itemOrArrayToArray(input);
		expect(result).toEqual(input);
	});

	// Test for boolean input
	it("should work with boolean input", () => {
		const result = itemOrArrayToArray(true);
		expect(result).toEqual([true]);
	});

	// Test for an array of booleans
	it("should work with an array of booleans", () => {
		const input = [true, false];
		const result = itemOrArrayToArray(input);
		expect(result).toEqual(input);
	});

	// Test for object input
	it("should work with object input", () => {
		const input = { key: "value" };
		const result = itemOrArrayToArray(input);
		expect(result).toEqual([input]);
	});

	// Test for an array of objects
	it("should work with an array of objects", () => {
		const input = [{ key: "value1" }, { key: "value2" }];
		const result = itemOrArrayToArray(input);
		expect(result).toEqual(input);
	});
});
