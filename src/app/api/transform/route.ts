import { NextResponse } from 'next/server';
import {
  storiesCatalog,
  customizationSchema,
  symbolTheologyMapping,
} from '../../../data/stories';
import { validateCustomizationsWithMapping } from '../../../lib/guardrails';
import { transformStory } from '../../../lib/transformer';
import type { BibleStory } from '../../../types';

export async function POST(request: Request) {
  let body: { storyId?: string; customizations?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { valid: false, errors: ['Invalid JSON body'] },
      { status: 400 }
    );
  }

  const { storyId, customizations } = body ?? {};

  if (!storyId || typeof storyId !== 'string') {
    return NextResponse.json(
      { valid: false, errors: ['storyId is required'] },
      { status: 400 }
    );
  }

  if (!customizations || typeof customizations !== 'object') {
    return NextResponse.json(
      { valid: false, errors: ['customizations must be an object'] },
      { status: 400 }
    );
  }

  const story: BibleStory | undefined = storiesCatalog.find(
    (s) => s.id === storyId
  );

  if (!story) {
    return NextResponse.json(
      { valid: false, errors: [`Unknown storyId: "${storyId}"`] },
      { status: 404 }
    );
  }

  const validation = validateCustomizationsWithMapping(
    customizations,
    story,
    customizationSchema,
    symbolTheologyMapping
  );

  if (!validation.valid) {
    return NextResponse.json(
      { valid: false, errors: validation.errors },
      { status: 400 }
    );
  }

  const { narrative, modifications } = transformStory(
    story,
    customizations,
    customizationSchema
  );

  return NextResponse.json({ narrative, modifications, valid: true });
}
