'use client';

import React, { useState } from 'react';

export default function CopyButton({ contests }: { contests: any[] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!contests || contests.length === 0) return;

    let text = '🌟 *Upcoming Coding Contests* 🌟\n\n';

    contests.forEach((contest, idx) => {
      text += `${idx + 1}. *${contest.name}*\n`;
      text += `📍 *Platform:* ${contest.platform.toUpperCase()}\n`;
      if (contest.university) text += `🏫 *University:* ${contest.university}\n`;
      if (contest.region) text += `🌍 *Region:* ${contest.region}\n`;
      text += `⏰ *Starts:* ${new Date(contest.start_time).toLocaleString()}\n`;
      text += `⏳ *Duration:* ${Math.round(contest.duration / 3600)} Hours\n`;
      text += `🔗 *Link:* ${contest.url}\n\n`;
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className="flex justify-center w-full max-w-5xl px-4 mb-6">
      <button 
        onClick={handleCopy}
        className={`w-full md:w-auto px-8 py-3 rounded-full font-bold shadow transition-colors flex items-center justify-center gap-2 ${
          copied ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'
        }`}
      >
        <span>{copied ? '✅ WhatsApp Schedule Copied!' : '📋 Copy Schedule for WhatsApp'}</span>
      </button>
    </div>
  );
}
