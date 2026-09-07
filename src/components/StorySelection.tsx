'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BibleStory, Theme, Character } from '../types';
import { storiesCatalog } from '../data/stories';

type StorySelectionProps = {
  onSelect: (story: BibleStory) => void;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-400"></div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-zinc-400 dark:text-zinc-600 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
      <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-1">
        No stories found
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-500">
        Try adjusting your search or filter criteria.
      </p>
    </div>
  );
}

function StoryCard({
  story,
  onSelect,
}: {
  story: BibleStory;
  onSelect: (story: BibleStory) => void;
}) {
  return (
    <button
      onClick={() => onSelect(story)}
      className="w-full text-left p-4 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
    >
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        {story.title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
        {story.reference}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
        {story.description}
      </p>
    </button>
  );
}

export default function StorySelection({ onSelect }: StorySelectionProps) {
  const [stories, setStories] = useState<BibleStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    async function fetchStories() {
      try {
        const response = await fetch('/api/stories');
        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }
        const data = await response.json();
        setStories(data.stories);
      } catch {
        setStories(storiesCatalog);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStories();
  }, []);

  const themes: Theme[] = useMemo(() => {
    const themeMap = new Map<string, Theme>();
    const storySource = stories.length > 0 ? stories : storiesCatalog;
    for (const story of storySource) {
      const themeId = story.coreTheme
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      if (!themeMap.has(themeId)) {
        themeMap.set(themeId, {
          id: themeId,
          name: story.coreTheme,
          description: story.description,
        });
      }
      for (const tag of story.doctrineTags) {
        const tagId = tag
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        if (!themeMap.has(tagId)) {
          themeMap.set(tagId, {
            id: tagId,
            name: tag,
            description: '',
          });
        }
      }
    }
    return Array.from(themeMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [stories]);

  const characters: Character[] = useMemo(() => {
    const charMap = new Map<string, Character>();
    const storySource = stories.length > 0 ? stories : storiesCatalog;
    for (const story of storySource) {
      for (const char of story.characters) {
        if (!charMap.has(char.id)) {
          charMap.set(char.id, char);
        }
      }
    }
    return Array.from(charMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [stories]);

  const filteredStories = useMemo(() => {
    const storySource = stories.length > 0 ? stories : storiesCatalog;
    return storySource.filter((story) => {
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const matchesTitle = story.title.toLowerCase().includes(query);
        const matchesReference = story.reference.toLowerCase().includes(query);
        if (!matchesTitle && !matchesReference) {
          return false;
        }
      }

      if (selectedTheme) {
        const themeMatches = [story.coreTheme, ...story.doctrineTags].some(
          (theme) =>
            theme
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '') === selectedTheme
        );
        if (!themeMatches) {
          const themeName = themes.find((t) => t.id === selectedTheme)?.name;
          if (themeName) {
            const matchesThemeName = [
              story.coreTheme,
              ...story.doctrineTags,
            ].some((t) => t.toLowerCase() === themeName.toLowerCase());
            if (!matchesThemeName) return false;
          } else {
            return false;
          }
        }
      }

      if (selectedCharacter) {
        const charMatches = story.characters.some(
          (char) =>
            char.id === selectedCharacter ||
            char.name
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '') === selectedCharacter
        );
        if (!charMatches) {
          const charName = characters.find(
            (c) => c.id === selectedCharacter
          )?.name;
          if (charName) {
            const matchesCharName = story.characters.some(
              (char) => char.name.toLowerCase() === charName.toLowerCase()
            );
            if (!matchesCharName) return false;
          } else {
            return false;
          }
        }
      }

      return true;
    });
  }, [
    stories,
    debouncedSearch,
    selectedTheme,
    selectedCharacter,
    themes,
    characters,
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Choose a Bible Story
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Browse and select a story to customize its surface elements while
          preserving doctrinal integrity.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search stories
          </label>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or reference..."
              className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
            />
          </div>
        </div>

        <div className="sm:w-48">
          <label htmlFor="theme-filter" className="sr-only">
            Filter by theme
          </label>
          <select
            id="theme-filter"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white py-2 px-3 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
          >
            <option value="">All Themes</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:w-48">
          <label htmlFor="character-filter" className="sr-only">
            Filter by character
          </label>
          <select
            id="character-filter"
            value={selectedCharacter}
            onChange={(e) => setSelectedCharacter(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white py-2 px-3 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
          >
            <option value="">All Characters</option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : filteredStories.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
