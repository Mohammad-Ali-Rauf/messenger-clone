import bcrypt from 'bcryptjs'

import prisma from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	const body = await request.json()
	const { name, email  } = body

	const existingUser = await prisma.user.findUnique({
		where: {
			email,
		},
	})

	if (existingUser) {
		return NextResponse.json({ message: 'User already exists.' })
	}

	const user = await prisma.user.create({
		data: {
			name,
			email,
			emailVerified: null,
		},
	})

	return NextResponse.json(user)
}
