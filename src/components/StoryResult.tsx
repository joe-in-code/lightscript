'use client';

import { useState, useCallback } from 'react';
import type { BibleStory, AppliedModification } from '../types';

type StoryResultProps = {
  result: {
    narrative: string;
    modifications: AppliedModification[];
  };
  story: BibleStory;
  onRegenerate: () => void;
};

const STORAGE_PREFIX = 'lightscript_saved_story_';

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5"
    >
      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5"
    >
      <path d="M7.75 3A2.75 2.75 0 005 5.75v7.5a2.75 2.75 0 002.75 2.75h7.5A2.75 2.75 0 0018 13.25v-7.5a2.75 2.75 0 00-2.75-2.75h-7.5zM6.5 5.75A1.25 1.25 0 017.75 4.5h7.5a1.25 1.25 0 011.25 1.25v7.5a1.25 1.25 0 01-1.25 1.25h-7.5A1.25 1.25 0 016.5 13.25v-7.5z" />
      <path d="M3 10.25A2.25 2.25 0 015.25 8h2.5A2.25 2.25 0 0110 10.25v5.5A2.25 2.25 0 017.75 18H5.25A2.25 2.25 0 013 15.75v-5.5z" />
    </svg>
  );
}

function RegenerateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5"
    >
      <path
        fillRule="evenodd"
        d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 01-.75-.75v-2.43a5.5 5.5 0 011.788-4.34l.424.424a.75.75 0 001.06-1.06l-.424-.424a7 7 0 00-2.233 5.694V15a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-2.43a.75.75 0 00-.22-.53l-.032-.032a5.5 5.5 0 019.201-2.466l.312.311v2.433a.75.75 0 001.5 0v-2.433a5.5 5.5 0 01-4.14-4.84l-.424-.424a.75.75 0 00-1.061 1.06l.424.424a3.5 3.5 0 011.788 4.34v2.43a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-2.43a3.5 3.5 0 01-4.34-1.788l-.424-.424a5.5 5.5 0 011.788-4.34l.424.424a.75.75 0 001.06-1.06l-.424-.424z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5"
    >
      <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.5h-1.5a.75.75 0 000 1.5h1.5v2.75a.75.75 0 001.5 0v-2.75h1.5a.75.75 0 000-1.5h-1.5v-8.5z" />
      <path
        fillRule="evenodd"
        d="M3 14a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ModificationItem({
  modification,
}: {
  modification: AppliedModification;
}) {
  return (
    <li className="space-y-1 rounded-md border border-zinc-200 p-3 dark:border-zinc-700">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {modification.field}
      </p>
      <div className="space-y-1 text-sm">
        <p>
          <span className="text-zinc-500 dark:text-zinc-400">Original:</span>{' '}
          <span className="font-mono text-zinc-800 dark:text-zinc-200">
            {modification.original}
          </span>
        </p>
        <p>
          <span className="text-zinc-500 dark:text-zinc-400">Replacement:</span>{' '}
          <span className="font-mono text-zinc-800 dark:text-zinc-200">
            {modification.replacement}
          </span>
        </p>
      </div>
    </li>
  );
}

export default function StoryResult({
  result,
  story,
  onRegenerate,
}: StoryResultProps) {
  const [modificationsOpen, setModificationsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = useCallback(() => {
    const payload = {
      narrative: result.narrative,
      modifications: result.modifications,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(
      `${STORAGE_PREFIX}${story.id}`,
      JSON.stringify(payload)
    );
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }, [result.narrative, result.modifications, story.id]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result.narrative);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = result.narrative;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }, [result.narrative]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([result.narrative], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${story.title.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [result.narrative, story.title]);

  const buttonBaseClass =
    'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {story.title}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {story.reference}
        </p>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="prose prose-zinc max-w-none dark:prose-invert">
          {result.narrative.split('\n').map((paragraph, index) => (
            <p
              key={index}
              className="mb-4 leading-7 text-zinc-800 dark:text-zinc-200"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setModificationsOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          <ChevronDownIcon open={modificationsOpen} />
          {modificationsOpen ? 'Hide' : 'Show'} applied modifications (
          {result.modifications.length})
        </button>

        {modificationsOpen && result.modifications.length > 0 && (
          <ul className="space-y-2">
            {result.modifications.map((modification, index) => (
              <ModificationItem key={index} modification={modification} />
            ))}
          </ul>
        )}

        {modificationsOpen && result.modifications.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No modifications were applied.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          className={`${buttonBaseClass} border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800`}
        >
          <SaveIcon />
          Save
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className={`${buttonBaseClass} border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800`}
        >
          <CopyIcon />
          Copy
        </button>

        <button
          type="button"
          onClick={onRegenerate}
          className={`${buttonBaseClass} border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800`}
        >
          <RegenerateIcon />
          Regenerate
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className={`${buttonBaseClass} border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800`}
        >
          <DownloadIcon />
          Download
        </button>
      </div>

      {showToast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42L8.5 12.08l6.79-6.79a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          Saved!
        </div>
      )}
    </div>
  );
}
