import { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";

declare module "next-auth" {
	interface Session {
		user?: {
			id: string;
			email?: string | null;
			role?: string | null;
			is_email_verified?: boolean
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
		role?: string;
	}
}
function getAuthSecret() {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET is missing at runtime");
  }
  return process.env.NEXTAUTH_SECRET;
}
export function auth() {
	return getServerSession(authOptions);
}

export const authOptions: NextAuthOptions = {
    secret: getAuthSecret(),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await db.query.users.findFirst({
					where: eq(users.email, credentials.email),
					columns: {
						id: true,
						email: true,
						password: true,
						is_email_verified: true,
					},
					with: {
						role: {
							columns: {
								name: true,
							},
						},
					}
					
				});

				if (!user) {
					return null;
				}

				const isPasswordValid = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!isPasswordValid) {
					return null;
				}

				const authed = {
					id: user.id.toString(),
					email: user.email,
					role:user.role.name,
					is_email_verified:user.is_email_verified
				};

				

				return authed;
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/auth/login",
		error: "/auth/login",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			    token.role = (user as unknown as { role: string }).role;
				token.is_email_verified = (user as unknown as { is_email_verified: boolean }).is_email_verified
				token.email = user.email
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token.id) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
				session.user.is_email_verified= token.is_email_verified as boolean
			}
			return session;
		},
	},
	debug: process.env.NODE_ENV === "development",
};
