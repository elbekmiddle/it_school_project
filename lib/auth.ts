import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function requireAuth(
  req: NextRequest,
  allowedRoles: ('admin' | 'instructor')[],
  callback: (user: { id: string; role: 'admin' | 'instructor' }) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = session.user as { id: string; role: 'admin' | 'instructor' };
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden: Insufficient role' }, { status: 403 });
  }

  return callback(user);
}
