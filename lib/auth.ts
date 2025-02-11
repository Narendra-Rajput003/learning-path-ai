import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./db/connect";
import {User} from "./db/models/user.model"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        await connectDB();

        const user = await User.findOne({email:credentials.email}).select("-password");
        if(!user){
            throw new Error("No user founf with this email")
        }

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id:user._id.toString(),
            email:user.email,
            name:user.name
          }
      },
    }),
  ],
  pages:{
    signIn:"/signin",
    error:"/signin"
  },

  session:{
    strategy:"jwt",
    maxAge:30 * 24 * 60 * 60, // 30 days
  },
  callbacks:{
    async jwt({token,user}){
        if(user){
            token.id = user.id;
        }
        return token;
    },

    async session({session,token}) {
        if(token && session.user){
            session.user.id = token.id;
        }
        return session;
    }

  },
  secret:process.env.NEXTAUTH_SECRET,

};
