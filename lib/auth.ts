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
          console.log("[auth] ⚠️ USING ADMIN BYPASS - UPSERTING USER");

          // Upsert the admin user to ensure they exist for FK constraints
          const adminUser = await prisma.user.upsert({
            where: { email: "admin@growzzy.com" },
            update: {},
            create: {
              email: "admin@growzzy.com",
              name: "Admin User",
              password: await bcrypt.hash("admin", 10),
              // id will be auto-generated (cuid), but we return it
            }
          });

          return {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            image: adminUser.image
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
            image: user.image
          };
        } catch (error: any) {
          console.error("[auth] Authorize error:", error.message);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
});
