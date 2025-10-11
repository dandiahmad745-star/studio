// This is a new file
import { getStore } from '@netlify/blobs';
import { NextResponse } from 'next/server';
import { initialDatabase } from '@/lib/database';

const STORE_KEY = 'database';

export const GET = async () => {
  try {
    const store = getStore('kopimi-kafe-data');
    const data = await store.get(STORE_KEY, { type: 'json' });

    if (!data) {
      // If no data, initialize with default and return it
      await store.setJSON(STORE_KEY, initialDatabase);
      return NextResponse.json(initialDatabase);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET Error:', error);
    // Return initial data as a fallback on error
    return NextResponse.json(initialDatabase, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const newData = await request.json();
    const store = getStore('kopimi-kafe-data');
    await store.setJSON(STORE_KEY, newData);
    return NextResponse.json({ success: true, message: 'Data saved.' });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to save data.' }, { status: 500 });
  }
};

// This ensures the function is treated as dynamic and not cached
export const dynamic = 'force-dynamic';
