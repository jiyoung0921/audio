import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'openid email profile https://www.googleapis.com/auth/drive.file',
                    access_type: 'offline',
                    // prompt: 'consent' -> Removed to prevent re-consent loop with SSO
                },
            },
            // SSO Compatibility: Only use PKCE, skip state check to avoid mismatch after multiple redirects
            checks: ['pkce'],
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Initial sign in
            if (account) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    expiresAt: account.expires_at,
                };
            }

            // Return previous token if not expired (with 5 min buffer)
            if (token.expiresAt && Date.now() < (token.expiresAt as number) * 1000 - 5 * 60 * 1000) {
                return token;
            }

            // Token expired, try to refresh
            if (token.refreshToken) {
                try {
                    const response = await fetch('https://oauth2.googleapis.com/token', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({
                            client_id: process.env.GOOGLE_CLIENT_ID!,
                            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                            grant_type: 'refresh_token',
                            refresh_token: token.refreshToken as string,
                        }),
                    });

                    const tokens = await response.json();

                    if (!response.ok) {
                        throw tokens;
                    }

                    return {
                        ...token,
                        accessToken: tokens.access_token,
                        expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in),
                        // Keep refresh token if not rotated
                        refreshToken: tokens.refresh_token ?? token.refreshToken,
                    };
                } catch (error) {
                    console.error('Error refreshing access token:', error);
                    return { ...token, error: 'RefreshAccessTokenError' };
                }
            }

            return token;
        },
        async session({ session, token }) {
            (session as any).accessToken = token.accessToken;
            (session as any).refreshToken = token.refreshToken;
            (session as any).expiresAt = token.expiresAt;
            (session as any).error = token.error;
            return session;
        },
    },
    pages: {
        signIn: '/',
    },
    // SSO Compatibility: Trust Vercel/Proxy host
    trustHost: true,
    // SSO Compatibility: Allow cross-site cookies for IdP redirects
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'none',
                path: '/',
                secure: true,
            },
        },
        callbackUrl: {
            name: `next-auth.callback-url`,
            options: {
                sameSite: 'none',
                path: '/',
                secure: true,
            },
        },
        csrfToken: {
            name: `next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'none',
                path: '/',
                secure: true,
            },
        },
        pkceCodeVerifier: {
            name: `next-auth.pkce.code_verifier`,
            options: {
                httpOnly: true,
                sameSite: 'none',
                path: '/',
                secure: true,
            },
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
