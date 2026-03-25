import React from 'react';
import fs from 'fs';
import path from 'path';

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

      <div className="w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.length === 0 ? (
          <p className="col-span-full justify-self-center text-gray-500 italic">No upcoming contests currently indexed.</p>
        ) : (
          contests.map((contest: any) => (
            <div key={contest.contest_id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {contest.platform}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${contest.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {contest.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                  {contest.name}
                </h2>
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <p>🗓 {new Date(contest.start_time).toLocaleString()}</p>
                  <p>⏱ {Math.round(contest.duration / 3600)} Hours</p>
                  {contest.university && <p>🏫 {contest.university}</p>}
                </div>
              </div>
              <a 
                href={contest.url}
                target="_blank"
                rel="noreferrer" 
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-center transition-colors"
              >
                Register / View
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
