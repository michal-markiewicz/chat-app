import Hasher from "@/app/server/helpers/Hasher";
import UserService from "@/app/server/helpers/UserService";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const hasher = new Hasher();
const userService = new UserService();

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const user = await userService.getUser({
          username: credentials.username,
        });

        if (user.password) {
          const passwordMatch = await hasher.comparePasswords(
            credentials.password,
            user.password
          );

          if (passwordMatch) {
            return {
              id: "1",
              username: user.username,
            };
          }
        }

        return null;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
