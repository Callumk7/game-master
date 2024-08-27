import { db } from ".";
import { users } from "./schemas/users";

const seedUserData = [
	{
		firstName: "John",
		lastName: "Doe",
		email: "john.doe@example.com",
	},
	{
		firstName: "Jane",
		lastName: "Smith",
		email: "jane.smith@example.com",
	},
	{
		firstName: "Michael",
		lastName: "Johnson",
		email: "michael.johnson@example.com",
	},
	{
		firstName: "Emily",
		lastName: "Brown",
		email: "emily.brown@example.com",
	},
	{
		firstName: "David",
		lastName: "Wilson",
		email: "david.wilson@example.com",
	},
];

async function seedUsers() {
	await db.insert(users).values(seedUserData);
	console.log("Users seeded successfully");
}

seedUsers().catch(console.error);
