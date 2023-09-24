import { verifyPassword } from "@/lib/auth";
import { connetToDatabase } from "@/lib/db";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connetToDatabase();
        const userCollection = client.db().collection("users");

        const user = await userCollection.findOne({ email: credentials.email });
        if (!user) {
          client.close();
          throw new Error("No user Found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        ); //credential.password which is user entered password for login , user.password database saved password
        if (!isValid) {
          throw new Error("Could not log you in");
        }
        client.close();
        return { email: user.email };
      },
    }),
  ],
});
