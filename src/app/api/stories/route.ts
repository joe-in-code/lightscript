import { NextResponse } from 'next/server';
import { storiesCatalog } from '../../../data/stories';
import type { BibleStory } from '../../../types';

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get('theme')?.toLowerCase().trim();
  const character = searchParams.get('character')?.toLowerCase().trim();
  const setting = searchParams.get('setting')?.toLowerCase().trim();

  let stories: BibleStory[] = storiesCatalog;

  if (theme) {
    stories = stories.filter((story) =>
      [story.coreTheme, ...story.doctrineTags].some((value) =>
        value.toLowerCase().includes(theme)
      )
    );
  }

  if (character) {
    stories = stories.filter((story) =>
      story.characters.some(
        (c) =>
          c.name.toLowerCase().includes(character) ||
          c.role.toLowerCase().includes(character)
      )
    );
  }

  if (setting) {
    stories = stories.filter((story) =>
      [
        story.setting.location.name,
        story.setting.location.region,
        story.setting.environment,
        story.setting.description,
      ].some((value) => value.toLowerCase().includes(setting))
    );
  }

  return NextResponse.json({ stories });
}
