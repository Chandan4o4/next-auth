import { MongoClient } from "mongodb";

export async function connetToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://ck94422:D372OWvExZ4OQLRA@test.4sffjfp.mongodb.net/"
  );
  return client;
}
