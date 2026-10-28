import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

import { sendLoginOtpEmail } from "./mailer";

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.email },
                { phone: credentials.email }
              ]
            }
          });

          if (!user || !user.passwordHash) {
            throw new Error("Invalid email or password");
          }

          if (user.lockedUntil && user.lockedUntil > new Date()) {
            const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
            throw new Error(`Your account has been temporarily locked for security reasons. Please try again in ${minutesLeft} minutes, or reset your password.`);
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

          if (!isPasswordValid) {
            const attempts = (user.failedLoginAttempts || 0) + 1;
            
            if (attempts >= 5) {
              await prisma.user.update({
                where: { id: user.id },
                data: { 
                  failedLoginAttempts: 0, 
                  lockedUntil: new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes
                }
              });
              throw new Error("Too many failed attempts. Your account has been temporarily locked for 15 minutes. Please reset your password.");
            } else {
              await prisma.user.update({
                where: { id: user.id },
                data: { failedLoginAttempts: attempts }
              });
              throw new Error(`Invalid email or password. You have ${5 - attempts} attempts left.`);
            }
          } else {
            // Reset attempts on successful password match
            if (user.failedLoginAttempts > 0) {
              await prisma.user.update({
                where: { id: user.id },
                data: { failedLoginAttempts: 0 }
              });
            }
          }

          if (credentials.role && user.role !== credentials.role) {
            throw new Error("Invalid account role");
          }

          // --- 2FA OTP LOGIC (TEMPORARILY DISABLED) ---
          /*
          const providedOtp = credentials.otp?.trim();
          
          if (!providedOtp || providedOtp === "undefined" || providedOtp === "null") {
            // Generate a 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            const identifier = user.email || user.phone!;

            // Save to DB (override if exists)
            await prisma.verificationToken.deleteMany({
              where: { identifier }
            });

            await prisma.verificationToken.create({
              data: {
                identifier,
                token: otp,
                expires
              }
            });

            // Send the OTP via Resend
            try {
               if (user.email) {
                 const result = await sendLoginOtpEmail(user.email, otp);
                 if (!result.success) {
                   console.error("Resend API failed:", result.error);
                   throw new Error("Failed to dispatch 2FA email. Please try again.");
                 }
               } else {
                 // Fallback if user only has a phone number (SMS gateway integration would go here)
                 console.log(`[DEV MODE] Would send SMS OTP ${otp} to phone ${user.phone}`);
               }
            } catch (e) {
               console.error("Failed to send 2FA OTP", e);
               throw new Error("Failed to dispatch 2FA email. Please try again.");
            }

            throw new Error("2FA_REQUIRED");
          } else {
            const identifier = user.email || user.phone!;

            // If OTP was provided, verify it
            const record = await prisma.verificationToken.findFirst({
              where: {
                identifier
              },
              orderBy: {
                expires: 'desc'
              }
            });

            if (!record) {
               throw new Error("Invalid OTP");
            }

            if (record.expires < new Date()) {
               throw new Error("OTP has expired");
            }

            if (record.token !== providedOtp) {
               const newAttempts = (record.attempts || 0) + 1;
               
               if (newAttempts >= 4) {
                 await prisma.verificationToken.delete({ where: { id: record.id } });
                 throw new Error("Too many failed attempts. Please log in again to receive a new code.");
               } else {
                 await prisma.verificationToken.update({
                   where: { id: record.id },
                   data: { attempts: newAttempts }
                 });
                 throw new Error(`Invalid OTP. You have ${4 - newAttempts} attempts left.`);
               }
            }

            // Cleanup OTP after successful use
            await prisma.verificationToken.delete({
              where: { id: record.id }
            });
          }
          */

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          if (error.code) {
             console.error("[Database Auth Error]", error);
             throw new Error("An internal server error occurred. Please try again later.");
          }
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role;
        if (token.labId) {
          session.user.labId = token.labId;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        
        if (user.role === "LAB_PARTNER") {
          const lab = await prisma.laboratory.findUnique({
            where: { userId: user.id },
            select: { id: true }
          });
          if (lab) {
            token.labId = lab.id;
          }
        }
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
  },
};
