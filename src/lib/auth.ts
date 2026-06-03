import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// 演示用户数据（实际项目中应使用数据库）
const demoUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123', // 实际项目中应使用 bcrypt 加密
    name: '测试用户',
    role: 'USER' as const,
  },
  {
    id: '2',
    email: 'creator@example.com',
    password: 'creator123',
    name: '路北行',
    role: 'CREATOR' as const,
  },
]

// 存储新注册的用户（临时存储）
let registeredUsers = [...demoUsers]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        isRegister: { label: 'Is Register', type: 'text' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // 检查是否是注册请求
        const isRegister = (req?.body as any)?.isRegister === 'true'
        
        if (isRegister) {
          // 注册流程
          const name = (req?.body as any)?.name || '新用户'
          
          // 检查邮箱是否已存在
          const existingUser = registeredUsers.find(u => u.email === credentials.email)
          if (existingUser) {
            return null
          }
          
          // 创建新用户
          const newUser = {
            id: String(registeredUsers.length + 1),
            email: credentials.email,
            password: credentials.password, // 实际项目中应加密
            name,
            role: 'USER' as const,
          }
          registeredUsers.push(newUser)
          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          }
        }

        // 登录流程
        const user = registeredUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        )

        if (!user) {
          return null
        }

        // 返回用户信息（不包含密码
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  secret: process.env.NEXTAUTH_SECRET,
}
