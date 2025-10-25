import { getStore } from '@netlify/blobs';
import { NextResponse } from 'next/server';
import { initialDatabase } from '@/lib/database';

const STORE_KEY = 'database';

// Helper function to handle Netlify Blob operations
const getNetlifyStore = () => getStore('kopimi-kafe-data');

export const GET = async () => {
  // Only use Netlify Blobs if the NETLIFY environment variable is set
  if (process.env.NETLIFY) {
    try {
      const store = getNetlifyStore();
      const data = await store.get(STORE_KEY, { type: 'json' });

      if (!data) {
        // If no data, initialize with default and return it
        await store.setJSON(STORE_KEY, initialDatabase);
        return NextResponse.json(initialDatabase);
      }
      return NextResponse.json(data);
    } catch (error) {
      console.error('Netlify GET Error:', error);
      // Fallback to initial data on error
      return NextResponse.json(initialDatabase, { status: 500 });
    }
  } else {
    // In local development, just return the initial database
    return NextResponse.json(initialDatabase);
  }
};

export const POST = async (request: Request) => {
  // Only use Netlify Blobs if the NETLIFY environment variable is set
  if (process.env.NETLIFY) {
    try {
      const newData = await request.json();
      const store = getNetlifyStore();
      await store.setJSON(STORE_KEY, newData);
      return NextResponse.json({ success: true, message: 'Data saved to Netlify Blobs.' });
    } catch (error) {
      console.error('Netlify POST Error:', error);
      return NextResponse.json({ success: false, message: 'Failed to save data to Netlify Blobs.' }, { status: 500 });
    }
  } else {
    // In local development, simulate a successful save
     console.log('Simulating a POST request in local development. Data is not saved.');
    return NextResponse.json({ success: true, message: 'Data save simulated locally.' });
  }
};

// This ensures the function is treated as dynamic and not cached
export const dynamic = 'force-dynamic';
