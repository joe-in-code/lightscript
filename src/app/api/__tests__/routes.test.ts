/** @jest-environment node */
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => {
      const response = new Response(JSON.stringify(data), {
        status: init?.status ?? 200,
        headers: { 'Content-Type': 'application/json' },
      });
      return response;
    },
  },
}));

import { GET as getStories } from '../stories/route';
import { POST as postTransform } from '../transform/route';
import type { BibleStory } from '../../../types';

describe('GET /api/stories', () => {
  it('returns all 5 stories in the catalog', async () => {
    const response = await getStories(
      new Request('http://localhost/api/stories')
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.stories).toHaveLength(5);
    expect(data.stories.map((s: { id: string }) => s.id)).toEqual([
      'david-and-goliath',
      'the-good-samaritan',
      'the-prodigal-son',
      'moses-and-passover',
      'daniel-lions-den',
    ]);
  });

  it('returns stories with expected fields', async () => {
    const response = await getStories(
      new Request('http://localhost/api/stories')
    );
    const data = await response.json();

    const story = data.stories[0];
    expect(story).toHaveProperty('id');
    expect(story).toHaveProperty('title');
    expect(story).toHaveProperty('narrative');
    expect(story).toHaveProperty('characters');
    expect(story).toHaveProperty('setting');
  });

  it('filters stories by theme query param', async () => {
    const response = await getStories(
      new Request('http://localhost/api/stories?theme=grace')
    );
    const data = await response.json();

    expect(data.stories.length).toBeGreaterThan(0);
    data.stories.forEach((story: BibleStory) => {
      const allText = [story.coreTheme, ...story.doctrineTags]
        .join(' ')
        .toLowerCase();
      expect(allText).toContain('grace');
    });
  });
});

describe('POST /api/transform', () => {
  const validCustomizations = {
    heroName: 'Ethan',
    setting: 'a quiet village beside olive groves',
    timePeriod: 'under the reign of a great king who tested the hearts of men',
    heroRole: 'a faithful witness who will not compromise',
    tone: 'hopeful and triumphant',
  };

  it('returns 200 with narrative for valid customizations', async () => {
    const body = JSON.stringify({
      storyId: 'david-and-goliath',
      customizations: validCustomizations,
    });

    const response = await postTransform(
      new Request('http://localhost/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.valid).toBe(true);
    expect(data.narrative).toBeDefined();
    expect(data.narrative).toContain('Ethan');
    expect(data.modifications).toBeDefined();
    expect(data.modifications.length).toBeGreaterThan(0);
  });

  it('returns 400 with errors for doctrine-distorting customizations', async () => {
    const body = JSON.stringify({
      storyId: 'david-and-goliath',
      customizations: {
        heroName: 'Good',
      },
    });

    const response = await postTransform(
      new Request('http://localhost/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
    );

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.valid).toBe(false);
    expect(data.errors).toBeDefined();
    expect(data.errors.length).toBeGreaterThan(0);
    expect(
      data.errors.some((e: string) => e.includes('doctrinal inversion'))
    ).toBe(true);
  });

  it('returns 400 when customizing with sin -> good inversion in tone', async () => {
    const body = JSON.stringify({
      storyId: 'david-and-goliath',
      customizations: {
        tone: 'all things work for good',
      },
    });

    const response = await postTransform(
      new Request('http://localhost/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
    );

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.valid).toBe(false);
  });

  it('returns 400 for invalid JSON body', async () => {
    const response = await postTransform(
      new Request('http://localhost/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not-json',
      })
    );

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.valid).toBe(false);
    expect(data.errors).toContain('Invalid JSON body');
  });

  it('returns 400 when storyId is missing', async () => {
    const body = JSON.stringify({
      customizations: validCustomizations,
    });

    const response = await postTransform(
      new Request('http://localhost/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
    );

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.valid).toBe(false);
  });

  it('returns 400 when customizations object is missing', async () => {
    const body = JSON.stringify({
      storyId: 'david-and-goliath',
    });

    const response = await postTransform(
      new Request('http://localhost/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
    );

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.valid).toBe(false);
  });

  it('returns 404 for unknown storyId', async () => {
    const body = JSON.stringify({
      storyId: 'nonexistent-story',
      customizations: validCustomizations,
    });

    const response = await postTransform(
      new Request('http://localhost/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
    );

    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.valid).toBe(false);
  });
});
