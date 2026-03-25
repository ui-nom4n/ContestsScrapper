'use client';

import React, { useState } from 'react';

export default function ContestList({ initialContests }: { initialContests: any[] }) {
  const [filter, setFilter] = useState<'All' | 'Pakistan' | 'University'>('All');

  const filteredContests = initialContests.filter((contest) => {
    if (filter === 'All') return true;
    if (filter === 'Pakistan') return contest.region?.toLowerCase() === 'pakistan';
    if (filter === 'University') return !!contest.university;
    return true;
  });

  return (
    <div className="w-full flex flex-col items-center">
      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {['All', 'Pakistan', 'University'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2 rounded-full font-bold shadow-sm transition-all text-sm md:text-base ${
              filter === f 
                ? 'bg-blue-600 text-white border border-blue-600 scale-105' 
                : 'bg-white text-blue-600 border border-gray-200 hover:border-blue-400'
            }`}
          >
            {f === 'All' ? '🌟 All Contests' : f === 'Pakistan' ? '🇵🇰 Pakistan Events' : '🏫 Universities Only'}
          </button>
        ))}
      </div>

      {/* CONTEST GRID */}
      <div className="w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredContests.length === 0 ? (
          <p className="col-span-full justify-self-center text-gray-500 italic py-12">No contests found for this filter.</p>
        ) : (
          filteredContests.map((contest: any) => (
            <div key={contest.contest_id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 flex flex-col">
              {/* POSTER BANNER */}
              {contest.poster ? (
                <div className="h-48 bg-gray-100 border-b border-gray-100 w-full">
                  <img src={contest.poster} alt={`Poster for ${contest.name}`} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-4 bg-blue-600 w-full" />
              )}
              
              {/* CONTENT */}
              <div className="p-6 flex flex-col flex-grow justify-between">
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
                    {contest.region && <p className="capitalize">🌍 {contest.region}</p>}
                  </div>
                </div>
                <a 
                  href={contest.url}
                  target="_blank"
                  rel="noreferrer" 
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-center transition-colors shadow"
                >
                  Register / View
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
