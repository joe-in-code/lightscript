import type {
  BibleStory,
  CustomizationSchema,
  AppliedModification,
} from '../types';

function getPlaceholderValue(
  story: BibleStory,
  placeholder: string,
  customizations: Record<string, string>
): string {
  if (placeholder === 'heroName' || placeholder === '{{heroName}}') {
    return customizations['heroName'] ?? story.characters[0]?.name ?? '';
  }
  if (
    placeholder === 'antagonistName' ||
    placeholder === '{{antagonistName}}'
  ) {
    return customizations['antagonistName'] ?? story.characters[1]?.name ?? '';
  }
  if (placeholder === 'setting' || placeholder === '{{setting}}') {
    return customizations['setting'] ?? story.setting.environment;
  }
  if (placeholder === 'timePeriod' || placeholder === '{{timePeriod}}') {
    return customizations['timePeriod'] ?? story.timePeriod;
  }
  if (placeholder === 'heroRole' || placeholder === '{{heroRole}}') {
    return customizations['heroRole'] ?? story.characters[0]?.role ?? '';
  }
  if (placeholder === 'symbol1' || placeholder === '{{symbol1}}') {
    return customizations['symbol1'] ?? story.keySymbols[0] ?? '';
  }
  return '';
}

function resolvePlaceholderName(key: string): string {
  const match = key.match(/\{\{(\w+)\}\}/);
  return match ? match[1] : key;
}

export function transformStory(
  story: BibleStory,
  customizations: Record<string, string>,
  schema: CustomizationSchema
): { narrative: string; modifications: AppliedModification[] } {
  let narrative = story.narrative;
  const modifications: AppliedModification[] = [];

  const storyFieldMap: Record<string, string> = {};
  for (const option of schema) {
    storyFieldMap[option.id] = option.storyField;
  }

  const schemaIds = schema.map((o) => o.id);
  const usedKeys = new Set<string>();

  const placeholders = narrative.match(/\{\{\w+\}\}/g) ?? [];
  const seen = new Set<string>();

  for (const rawPlaceholder of placeholders) {
    const placeholderName = resolvePlaceholderName(rawPlaceholder);
    if (seen.has(placeholderName)) continue;
    seen.add(placeholderName);

    let originalValue = '';
    let replacementValue = '';

    if (placeholderName === 'heroName') {
      originalValue = story.characters[0]?.name ?? '';
      replacementValue = customizations['heroName'] ?? originalValue;
    } else if (placeholderName === 'antagonistName') {
      originalValue = story.characters[1]?.name ?? '';
      replacementValue = customizations['antagonistName'] ?? originalValue;
    } else if (placeholderName === 'setting') {
      originalValue = story.setting.environment;
      replacementValue = customizations['setting'] ?? originalValue;
    } else if (placeholderName === 'timePeriod') {
      originalValue = story.timePeriod;
      replacementValue = customizations['timePeriod'] ?? originalValue;
    } else if (placeholderName === 'heroRole') {
      originalValue = story.characters[0]?.role ?? '';
      replacementValue = customizations['heroRole'] ?? originalValue;
    } else if (placeholderName === 'symbol1') {
      originalValue = story.keySymbols[0] ?? '';
      replacementValue = customizations['symbol1'] ?? originalValue;
    } else {
      originalValue = getPlaceholderValue(
        story,
        placeholderName,
        customizations
      );
      replacementValue = originalValue;
    }

    narrative = narrative.split(rawPlaceholder).join(replacementValue);

    if (replacementValue !== originalValue) {
      modifications.push({
        field: placeholderName,
        original: originalValue,
        replacement: replacementValue,
      });
      usedKeys.add(placeholderName);
    }
  }

  for (const id of schemaIds) {
    if (usedKeys.has(id)) continue;
    const customizationValue = customizations[id];
    if (!customizationValue) continue;

    let originalValue = '';
    let replacementValue = customizationValue;

    if (id === 'heroName') {
      originalValue = story.characters[0]?.name ?? '';
    } else if (id === 'antagonistName') {
      originalValue = story.characters[1]?.name ?? '';
    } else if (id === 'setting') {
      originalValue = story.setting.environment;
    } else if (id === 'timePeriod') {
      originalValue = story.timePeriod;
    } else if (id === 'heroRole') {
      originalValue = story.characters[0]?.role ?? '';
    } else if (id === 'symbol1') {
      originalValue = story.keySymbols[0] ?? '';
    } else if (id === 'tone') {
      originalValue = '';
      replacementValue = customizationValue;
    }

    if (replacementValue !== originalValue) {
      modifications.push({
        field: id,
        original: originalValue,
        replacement: replacementValue,
      });
    }
  }

  return { narrative, modifications };
}
