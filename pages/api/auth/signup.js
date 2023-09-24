import { hashPassword } from "@/lib/auth";
import { connetToDatabase } from "@/lib/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const data = req.body;
  const { email, password } = data;

  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({ message: "Invalid Input" });
    return;
  }

  const client = await connetToDatabase();

  const db = client.db();

  const existingUser = await db.collection('Users').findOne({email:email});
  if(existingUser){
    res.status(422).json({message:"user already exists"})
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  const result = await db
    .collection("Users")
    .insertOne({ email: email, password: hashedPassword });

  res.status(201).json({ message: "User Created Successfully!" });
  client.close();
}
export default handler;
