import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from 'next-auth';

export const { handlers, auth, signIn, signOut } = NextAuth({
    // pages: {
    //     signIn: "/authadmin/login",
    // },
    providers: [
        GithubProvider({
            profile(profile: any) {
                console.log("Profile Github : ", profile);

                let userRole = "Github User";
                if (profile?.email == "irshadali.kadiwala@codezeros.com") {
                    userRole = "admin"
                }
                return {
                    ...profile,
                    role: userRole
                }
            },
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
        Credentials({
            async authorize(credentials: any) {

                if (credentials?.username && credentials?.password) {
                    const { username, password } = credentials;
                    let data: any = await fetch(`${process.env.APP_URL}/api/auth/local`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            identifier: username, password
                        })
                    })
                    data = await data.json();
                    if (!data?.jwt) {
                        return null;
                    }
                    const res = {
                        user: {
                            ...data.user,
                            token: data.jwt
                        }
                    }
                    console.log("User login successfully = ", res);
                    return res;
                }
                return null
            }
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        jwt: async ({ token, user }: any) => {
            // token returns only (id, image, name, email) & user returns all things we pass in return object
            if (user) {
                token.role = user.user.type,
                token.name = user.user.username,
                token.email = user.user.email,
                token.token = user.user.token,
                token.id = user.user.id
            };
            return token;
        },
        session: async ({ session, token }: any) => {            
            // session returns only (name, email, image, expires) & token returns mostly same but format different
            if (session?.user) {
                session.user = { ...session.user, ...token }
            };
            return session;
        }
    }
}satisfies NextAuthConfig);