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
  { title: "Fourth Wing", author: "Rebecca Yarros", genre: "Fantasy Romance" },
  { title: "The Cruel Prince", author: "Holly Black", genre: "YA Fantasy" },
  { title: "Once Upon a Broken Heart", author: "Stephanie Garber", genre: "YA Fantasy Romance" },
  { title: "Legendborn", author: "Tracy Deonn", genre: "YA Urban Fantasy" },
  { title: "The Love Hypothesis", author: "Ali Hazelwood", genre: "Contemporary Romance" },
  { title: "It Ends With Us", author: "Colleen Hoover", genre: "Contemporary Romance" },
  { title: "The Spanish Love Deception", author: "Elene Armas", genre: "Contemporary Romance" },
  { title: "The Deal", author: "Elle Kennedy", genre: "New Adult Romance" }
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
      console.log(`${index + 1}. ${book.title} (Author: ${book.author}, Genre: ${book.genre})`);

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