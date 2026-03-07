import 'server-only';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error('SESSION_SECRET is not set');
}

const encodedKey = new TextEncoder().encode(secretKey);


export interface SessionPayload {
  userId: string;
  email: string;
  username: string;
  expiresAt: Date;
}

interface RawSessionPayload extends JWTPayload {
  userId: string;
  email: string;
  username: string;
  expiresAt: string;
}


export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    username: payload.username,
    expiresAt: payload.expiresAt.toISOString(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}


export async function decrypt(
  session: string | undefined = ''
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify<RawSessionPayload>(
      session,
      encodedKey,
      {
        algorithms: ['HS256'],
      }
    );

    
    if (
      typeof payload.userId !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.username !== 'string' ||
      typeof payload.expiresAt !== 'string'
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
      expiresAt: new Date(payload.expiresAt),
    };
  } catch {
    return null;
  }
}


export async function createSession(
  userId: string,
  email: string,
  username: string
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await encrypt({
    userId,
    email,
    username,
    expiresAt,
  });

  const cookieStore = await cookies();

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;

  return await decrypt(session);
}
