import { NextRequest, NextResponse } from 'next/server';
import { SessionService } from '@/src/modules/sessions/service';
import { Logger } from '@/src/lib/logger';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const sessionToken = token;
    
    // Validate session token via Domain Engine
    const session = await SessionService.validateSession(sessionToken);

    // Set secure HTTP-only cookie to maintain session state across the app
    const cookieStore = await cookies();
    cookieStore.set('dining_session_id', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 4, // 4 hours
    });

    // Redirect to the digital menu
    return NextResponse.redirect(new URL('/menu', request.url));
  } catch (error: unknown) {
    Logger.error('[QR Route] Session validation failed:', error, 'QR');
    // Redirect to a graceful error page if the token is invalid or expired
    return NextResponse.redirect(new URL('/?error=invalid_session', request.url));
  }
}
