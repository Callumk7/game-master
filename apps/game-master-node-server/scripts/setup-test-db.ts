import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

// TODO: This might just be seeding, and I will write
// a shell script to handle the db:push with the correct
// environment variables set, in order to make sure that 
// the db has the correct schema while running tests
