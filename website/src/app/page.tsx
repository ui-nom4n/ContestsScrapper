import React from 'react';
import fs from 'fs';
import path from 'path';
import CopyButton from '../components/CopyButton';
import ContestList from '../components/ContestList';

async function getContests() {
  const dataPath = path.join(process.cwd(), '..', 'data', 'contests', 'upcoming.json');
  try {
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to parse contests:', error);
    return [];
  }
}

export default async function Home() {
  const contests = await getContests();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-6 tracking-tight">
        Pakistan Automated Coding Contests
      </h1>
      <p className="text-gray-600 mb-10 max-w-2xl text-center text-lg leading-relaxed">
        Discover upcoming competitive programming events across major platforms and local universities.
      </p>

      <CopyButton contests={contests} />
      <ContestList initialContests={contests} />
    </div>
  );
}
