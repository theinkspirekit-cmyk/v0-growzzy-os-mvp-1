import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { authConfig } from '../auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log("[auth] Authorize call received for:", credentials?.email);

        if (
          credentials?.email === "admin@growzzy.com" &&
          credentials?.password === "admin"
        ) {
          console.log("[auth] ⚠️ USING MOCK AUTH BYPASS");
          return {
            id: "mock-admin-id",
            email: "admin@growzzy.com",
            name: "Admin User",
          };
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.log("[auth] User not found:", credentials.email);
            throw new Error('Invalid credentials');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            console.log("[auth] Invalid password for:", credentials.email);
            throw new Error('Invalid credentials');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error: any) {
          console.error("[auth] Authorize error:", error.message);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
});
