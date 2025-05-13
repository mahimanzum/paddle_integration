import { createUsersTable } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await createUsersTable();
    return NextResponse.json({ message: 'Database table setup complete.' });
  } catch (error) {
    console.error('Error during DB setup:', error);
    return NextResponse.json({ message: 'Error setting up database table.', error: (error as Error).message }, { status: 500 });
  }
} 