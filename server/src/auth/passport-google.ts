import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient, Role } from "@prisma/client";
import { env } from "../env";

const prisma = new PrismaClient();
passport.use(new GoogleStrategy(
  { clientID: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET, callbackURL: env.OAUTH_REDIRECT_URI },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error("Google sin email"), undefined);
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName || "",
            image: profile.photos?.[0]?.value,
            provider: "google",
            role: Role.INQUILINO
          },
        });
      }
      return done(null, { id: user.id, email: user.email, role: user.role });
    } catch (e) {
      return done(e as any, undefined);
    }
  }
));
export default passport;
