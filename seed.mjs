import 'dotenv/config'
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Sample book data
const samplebooks = [
  { title: "", author: "", genre: "" },
  { title: "", author: "", genre: "" },
  { title: "", author: "", genre: "" },
  { title: "", author: "", genre: "" },
  { title: "", author: "", genre: "" },
  { title: "", author: "", genre: "" },
  { title: "", author: "", genre: "" },
  { title: "", author: "", genre: "" }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB Atlas!");

    const db = client.db("school");
    const collection = db.collection("books");

    // Check if books already exist
    const existingCount = await collection.countDocuments();
    console.log(`Found ${existingCount} existing books`);

    if (existingCount > 0) {
      console.log("🗑️  Clearing existing books before seeding...");
      await collection.deleteMany({});
      console.log("✅ Existing data cleared");
    }

    // Insert sample books
    const result = await collection.insertMany(samplebooks);
    console.log(`✅ Successfully seeded ${result.insertedCount} books!`);
    
    // Display inserted books
    console.log("\n📚 Sample books added:");
    samplebooks.forEach((book, index) => {
      console.log(`${index + 1}. ${book.name} (Author: ${book.author}, Genre: ${book.genre})`);
    });

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("\n🔌 Database connection closed");
  }
}

// Run the seed function
seedDatabase().catch(console.dir);