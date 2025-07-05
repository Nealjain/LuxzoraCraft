import NextAuth, { DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@/utils/supabase/server';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    isAdmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isAdmin: boolean;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const supabase = await createClient();

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials?.email || '',
          password: credentials?.password || '',
        });

        if (error) {
          console.error('Supabase sign-in error:', error.message);
          return null;
        }

        if (data.user) {
          // You might fetch additional user details from your 'users' table here
          // For now, we'll use the user data from Supabase auth
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata.full_name || data.user.email,
            isAdmin: data.user.user_metadata.isAdmin || false, // Assuming you have an isAdmin flag in user_metadata
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isAdmin = (user as any).isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        (session.user as any).isAdmin = token.isAdmin
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }