/* eslint-disable no-param-reassign */
import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

export const authOptions = {
  providers: [
    CredentialsProvider({
      type: 'credentials',
      async authorize(credentials) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
          {
            email: credentials.email,
            password: credentials.password,
          },
        )
        return response.data
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
      return true
    },
    async jwt({ profile, token, account, user }) {
      const userEmail = profile?.email
      // eslint-disable-next-line no-unused-vars
      const imageUrl = profile?.picture || null

      const isSignIn = !!user

      if (isSignIn && account) {
        if (account.provider === 'credentials') {
          token.jwt = user.jwt
        } else {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/${account?.provider}/callback?access_token=${account?.access_token}`,
          )
          const data = await response.json()
          token.jwt = data.jwt
        }
      }

      if (userEmail) {
        if (account) {
          token.accessToken = account.access_token
          token.id = profile.id
        }
      }

      return token
    },
    async session({ session, token, user }) {
      session.user = token
      session.user.id = user ? user.id : null
      session.user.image = token ? token.picture : null
      return session
    },
    async redirect({ url, baseUrl }) {
      // After sign-in, redirect to a specific page, e.g., "/dashboard"
      if (url === `${baseUrl}/login`) {
        return Promise.resolve('/dashboard')
      }
      // After sign-out, redirect to the homepage
      if (url === '/api/auth/signout') {
        return Promise.resolve(baseUrl)
      }
      // If no condition matches, proceed with the default URL
      return Promise.resolve(url)
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
