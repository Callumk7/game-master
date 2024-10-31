import { HTTPException } from "hono/http-exception";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { successResponse, validateOrThrowError } from "./http-helpers";

describe("validateOrThrowError", () => {
	// biome-ignore lint/suspicious/noExplicitAny: Test file
	let mockContext: any;
	const testSchema = z.object({
		name: z.string(),
		age: z.number(),
	});

	beforeEach(() => {
		mockContext = {
			req: {
				json: vi.fn(),
			},
		};
	});

	it("should return valid data when schema validation passes", async () => {
		const validData = { name: "John", age: 30 };
		mockContext.req.json.mockResolvedValue(validData);

		const result = await validateOrThrowError(testSchema, mockContext);
		expect(result).toEqual(validData);
	});

	it("should throw HTTPException with 400 status when schema validation fails", async () => {
		const invalidData = { name: "John", age: "thirty" };
		mockContext.req.json.mockResolvedValue(invalidData);

		await expect(validateOrThrowError(testSchema, mockContext)).rejects.toThrow(
			HTTPException,
		);
		await expect(
			validateOrThrowError(testSchema, mockContext),
		).rejects.toHaveProperty("status", 400);
	});

	it("should include validation error message in HTTPException when schema validation fails", async () => {
		const invalidData = { name: "John", age: "thirty" };
		mockContext.req.json.mockResolvedValue(invalidData);

		try {
			await validateOrThrowError(testSchema, mockContext);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPException);
			expect(error.message).toContain("Expected number, received string");
		}
	});

	it("should throw HTTPException with 400 status when JSON parsing fails", async () => {
		mockContext.req.json.mockRejectedValue(new Error("Invalid JSON"));

		await expect(validateOrThrowError(testSchema, mockContext)).rejects.toThrow(
			HTTPException,
		);
		await expect(
			validateOrThrowError(testSchema, mockContext),
		).rejects.toHaveProperty("status", 400);
	});

	it('should include "Failed to parse JSON" message when JSON parsing fails', async () => {
		mockContext.req.json.mockRejectedValue(new Error("Invalid JSON"));

		try {
			await validateOrThrowError(testSchema, mockContext);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPException);
			expect(error.message).toBe("Failed to parse JSON");
		}
	});

	it("should handle empty objects correctly", async () => {
		const emptySchema = z.object({});
		mockContext.req.json.mockResolvedValue({});

		const result = await validateOrThrowError(emptySchema, mockContext);
		expect(result).toEqual({});
	});

	it("should handle nested object schemas", async () => {
		const nestedSchema = z.object({
			user: z.object({
				name: z.string(),
				address: z.object({
					city: z.string(),
					zipCode: z.string(),
				}),
			}),
		});

		const validNestedData = {
			user: {
				name: "John",
				address: {
					city: "New York",
					zipCode: "10001",
				},
			},
		};

		mockContext.req.json.mockResolvedValue(validNestedData);

		const result = await validateOrThrowError(nestedSchema, mockContext);
		expect(result).toEqual(validNestedData);
	});

	it("should handle array schemas", async () => {
		const arraySchema = z.object({
			items: z.array(z.string()),
		});

		const validArrayData = {
			items: ["apple", "banana", "cherry"],
		};

		mockContext.req.json.mockResolvedValue(validArrayData);

		const result = await validateOrThrowError(arraySchema, mockContext);
		expect(result).toEqual(validArrayData);
	});

	it("should throw HTTPException when required fields are missing", async () => {
		const incompleteData = { name: "John" }; // Missing 'age' field
		mockContext.req.json.mockResolvedValue(incompleteData);

		await expect(validateOrThrowError(testSchema, mockContext)).rejects.toThrow(
			HTTPException,
		);
		await expect(
			validateOrThrowError(testSchema, mockContext),
		).rejects.toHaveProperty("status", 400);
	});

	it("should handle optional fields correctly", async () => {
		const schemaWithOptional = z.object({
			name: z.string(),
			age: z.number().optional(),
		});

		const dataWithoutOptional = { name: "John" };
		mockContext.req.json.mockResolvedValue(dataWithoutOptional);

		const result = await validateOrThrowError(schemaWithOptional, mockContext);
		expect(result).toEqual(dataWithoutOptional);
	});

	it("should handle union types correctly", async () => {
		const unionSchema = z.object({
			id: z.union([z.string(), z.number()]),
		});

		const validStringId = { id: "abc123" };
		mockContext.req.json.mockResolvedValue(validStringId);

		let result = await validateOrThrowError(unionSchema, mockContext);
		expect(result).toEqual(validStringId);

		const validNumberId = { id: 123 };
		mockContext.req.json.mockResolvedValue(validNumberId);

		result = await validateOrThrowError(unionSchema, mockContext);
		expect(result).toEqual(validNumberId);
	});
});

describe("successResponse", () => {
	// Mock Context object
	const mockJson = vi.fn();
	const mockContext = {
		json: mockJson,
		// biome-ignore lint/suspicious/noExplicitAny: Test suite
	} as any;

	it("should return a success response with the provided data", () => {
		const testData = { id: 1, name: "Test" };
		successResponse(mockContext, testData);

		expect(mockJson).toHaveBeenCalledWith({
			success: true,
			data: testData,
		});
	});

	it("should handle empty object as data", () => {
		successResponse(mockContext, {});

		expect(mockJson).toHaveBeenCalledWith({
			success: true,
			data: {},
		});
	});

	it("should handle null as data", () => {
		successResponse(mockContext, null);

		expect(mockJson).toHaveBeenCalledWith({
			success: true,
			data: null,
		});
	});

	it("should handle undefined as data", () => {
		successResponse(mockContext, undefined);

		expect(mockJson).toHaveBeenCalledWith({
			success: true,
			data: undefined,
		});
	});

	it("should handle array as data", () => {
		const arrayData = [1, 2, 3];
		successResponse(mockContext, arrayData);

		expect(mockJson).toHaveBeenCalledWith({
			success: true,
			data: arrayData,
		});
	});

	it("should handle string as data", () => {
		successResponse(mockContext, "test string");

		expect(mockJson).toHaveBeenCalledWith({
			success: true,
			data: "test string",
		});
	});

	it("should handle number as data", () => {
		successResponse(mockContext, 42);

		expect(mockJson).toHaveBeenCalledWith({
			success: true,
			data: 42,
		});
	});

	it("should handle boolean as data", () => {
		successResponse(mockContext, true);

		expect(mockJson).toHaveBeenCalledWith({
			success: true,
			data: true,
		});
	});

	it("should handle complex nested object as data", () => {
		const complexData = {
			id: 1,
			name: "Test",
			details: {
				age: 30,
				addresses: [
					{ street: "123 Main St", city: "Testville" },
					{ street: "456 Oak Rd", city: "Exampletown" },
				],
			},
			active: true,
		};
		successResponse(mockContext, complexData);

		expect(mockJson).toHaveBeenCalledWith({
			success: true,
			data: complexData,
		});
	});

	it("should always set success to true regardless of data", () => {
		successResponse(mockContext, false);

		expect(mockJson).toHaveBeenCalledWith({
			success: true,
			data: false,
		});
	});
});
