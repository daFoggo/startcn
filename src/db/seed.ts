import type { InsertUser } from "../features/users/schemas/users.schema";
import { usersTable } from "../features/users/schemas/users.schema";
import { db } from "./index";

const seed = async () => {
	console.log("🌱 Seeding database...");

	const users: InsertUser[] = Array.from({ length: 20 }).map((_, i) => ({
		name: `User ${i + 1}`,
		username: `user${i + 1}`,
		email: `user${i + 1}@example.com`,
		phone: `123-456-789${i % 10}`,
		website: `user${i + 1}.com`,
		address: {
			street: `${i + 1} Main St`,
			suite: `Suite ${i + 1}`,
			city: "Anytown",
			zipcode: `1234${i % 10}`,
			geo: {
				lat: "0.0000",
				lng: "0.0000",
			},
		},
		company: {
			name: `Company ${i + 1}`,
			catchPhrase: `Catchphrase ${i + 1}`,
			bs: `BS ${i + 1}`,
		},
	}));

	try {
		await db.insert(usersTable).values(users);
		console.log("✅ Database seeded successfully!");
	} catch (error) {
		console.error("❌ Seeding failed:", error);
	}

	process.exit(0);
};

seed();
