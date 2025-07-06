import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@/utils/supabase/server'

declare module 'next-auth' {
  interface User {
    id: string;
    isAdmin: boolean;
  }
  interface Session {
    user: User & {
      id: string;
      isAdmin: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isAdmin: boolean;
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          isAdmin: false, // Default to false for new Google users
        }
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const supabase = await createClient()

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })

        if (error || !data.user) {
          return null
        }

        // Fetch additional user data from your 'users' table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('id, email, name, is_admin')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.error('Error fetching user profile:', profileError.message)
          return null
        }

        return {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || data.user.email,
          isAdmin: profile?.is_admin || false, // Add isAdmin to the user object
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Handle Google OAuth sign-in
      if (account?.provider === 'google') {
        try {
          // Validate required user data
          if (!user.email) {
            console.error('Google OAuth: No email provided')
            return false
          }

          const supabase = await createClient()
          
          // Check if user already exists
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id, email, name, is_admin, avatar_url, provider, provider_id')
            .eq('email', user.email)
            .single()
          
          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching user:', fetchError)
            return false
          }
          
          if (!existingUser) {
            // Create new user
            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert({
                email: user.email,
                name: user.name,
                provider: 'google',
                provider_id: account.providerAccountId,
                avatar_url: user.image,
                email_verified: true,
              })
              .select('id, email, name, is_admin, avatar_url, provider, provider_id')
              .single()
            
            if (insertError) {
              console.error('Error creating user:', insertError)
              return false
            }
            
            user.id = newUser.id
            user.isAdmin = newUser.is_admin || false
          } else {
            // Update existing user with Google info if needed
            const { error: updateError } = await supabase
              .from('users')
              .update({
                name: user.name || existingUser.name,
                provider: 'google',
                provider_id: account.providerAccountId,
                avatar_url: user.image || existingUser.avatar_url,
                email_verified: true,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existingUser.id)
            
            if (updateError) {
              console.error('Error updating user:', updateError)
            }
            
            user.id = existingUser.id
            user.isAdmin = existingUser.is_admin || false
          }
        } catch (error) {
          console.error('Error in Google OAuth callback:', error)
          return false
        }
      }
      
      return true
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.isAdmin = (user as any).isAdmin // Persist isAdmin to the token
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.isAdmin = token.isAdmin as boolean // Expose isAdmin in the session
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error', // Custom error page
  },
  session: {
    strategy: 'jwt' as const,
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}
