import prisma from '@/app/lib/prisma'
import NextAuth from 'next-auth/next'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

import bcrypt from 'bcryptjs'
import { AuthOptions } from 'next-auth'

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	callbacks: { async redirect({ url, baseUrl }) { return baseUrl }, },
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID ?? "",
			clientSecret: process.env.GITHUB_SECRET ?? "",
		}),
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'text' }
			},
			async authorize(credentials) {
				if (!credentials?.email) {
					throw new Error('Invalid credentials')
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				})

				if (!user) {
					throw new Error('Invalid credentials')
				}

				return user
			},
		}),
	],
	debug: process.env.NODE_ENV === 'development',
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
