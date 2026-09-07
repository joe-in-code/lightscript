import type {
  BibleStory,
  CustomizationSchema,
  SymbolTheologyMapping,
} from '../types';

const DOCTRINAL_DENYLIST: [string, string][] = [
  ['sin', 'good'],
  ['sinner', 'saint'],
  ['wicked', 'holy'],
  ['sacrifice', 'transaction'],
  ['faith', 'works-only'],
  ['mercy', 'judgment-only'],
  ['grace alone', 'works alone'],
  ['forgiveness', 'condemnation'],
  ['repentance', 'persistence in sin'],
  ['faith alone', 'human effort alone'],
  ['righteousness by faith', 'righteousness by works'],
  ['unmerited favor', 'earned reward'],
  ['divine deliverance', 'self-salvation'],
  ['atonement', 'self-improvement'],
  ['redeemed', 'condemned'],
  ['salvation by grace', 'salvation by merit'],
];

function matchesDenylist(value: string): string | null {
  const lower = value.toLowerCase().trim();
  for (const [bad, replacement] of DOCTRINAL_DENYLIST) {
    const isBadTerm =
      lower === bad ||
      lower.includes(` ${bad} `) ||
      lower.startsWith(`${bad} `) ||
      lower.endsWith(` ${bad}`);
    const isInvertedReplacement =
      lower === replacement ||
      lower.includes(` ${replacement} `) ||
      lower.startsWith(`${replacement} `) ||
      lower.endsWith(` ${replacement}`);
    if (isBadTerm) {
      return `"${bad}" detected — doctrinal term that inverts moral intent`;
    }
    if (isInvertedReplacement) {
      return `"${replacement}" used as replacement for "${bad}" — doctrinal inversion detected`;
    }
  }
  return null;
}

function checkPreservesCore(
  customizations: Record<string, string>,
  story: BibleStory,
  schema: CustomizationSchema
): string[] {
  const errors: string[] = [];
  const protectedFields = ['coreTheme', 'theologicalMeaning', 'doctrineTags'];

  for (const [key, value] of Object.entries(customizations)) {
    if (protectedFields.some((field) => key.includes(field))) {
      errors.push(
        `Customization key "${key}" targets a protected doctrinal field (${protectedFields.join(', ')}), which must not be altered.`
      );
    }
    if (typeof value === 'string') {
      for (const field of protectedFields) {
        const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp(`\\b${escaped}\\b`, 'i').test(value)) {
          errors.push(
            `Customization value for "${key}" references a protected doctrinal field, which must not be altered.`
          );
          break;
        }
      }
    }
  }

  for (const option of schema) {
    if (option.guardrail !== 'preserves-core') continue;
    const customizationValue = customizations[option.id];
    if (customizationValue === undefined) continue;
    if (option.options && option.options.length > 0) {
      if (
        !option.options.some(
          (opt) => opt.toLowerCase() === customizationValue.toLowerCase()
        )
      ) {
        errors.push(
          `Preserves-core violation: field "${option.id}" value "${customizationValue}" is not among the allowed options. Core thematic content must remain unchanged.`
        );
      }
    } else {
      const actualValue = getStoryFieldValue(story, option.storyField);
      if (actualValue === undefined || actualValue !== customizationValue) {
        errors.push(
          `Preserves-core violation: field "${option.id}" (${option.storyField}) was modified. Core thematic content must remain unchanged.`
        );
      }
    }
  }

  return errors;
}

function checkDoesNotChangeDoctrine(
  customizations: Record<string, string>
): string[] {
  const errors: string[] = [];

  for (const [key, value] of Object.entries(customizations)) {
    const denylistHit = matchesDenylist(value);
    if (denylistHit) {
      errors.push(
        `doctrinal inversion in "${key}": ${denylistHit}. This customization would distort the theological meaning of the story.`
      );
    }
  }

  return errors;
}

function checkSymbolicIntegrity(
  customizations: Record<string, string>,
  story: BibleStory,
  mapping: SymbolTheologyMapping
): string[] {
  const errors: string[] = [];
  const symbolValue = customizations['symbol1'];
  if (!symbolValue) return errors;

  const originalSymbol = story.keySymbols[0];
  if (!originalSymbol) return errors;

  const replacementLower = symbolValue.toLowerCase().trim();
  const originalLower = originalSymbol.toLowerCase().trim();

  if (replacementLower === originalLower) return errors;

  const replacementMeaning = mapping[replacementLower];
  if (!replacementMeaning) {
    for (const [key, meaning] of Object.entries(mapping)) {
      if (key === originalLower) continue;
      if (
        key.toLowerCase().includes(replacementLower) ||
        replacementLower.includes(key.toLowerCase())
      ) {
        return [];
      }
    }
    errors.push(
      `Symbolic-integrity violation: "${symbolValue}" has no known theological meaning in the symbol mapping. Cannot confirm it preserves the theological meaning of "${originalSymbol}".`
    );
  }

  return errors;
}

export function validateCustomizations(
  customizations: Record<string, string>,
  story: BibleStory,
  schema: CustomizationSchema
): { valid: boolean; errors: string[] } {
  const errors: string[] = [
    ...checkPreservesCore(customizations, story, schema),
    ...checkDoesNotChangeDoctrine(customizations),
    ...checkSymbolicIntegrity(customizations, story, {}),
  ];

  return { valid: errors.length === 0, errors };
}

export function validateCustomizationsWithMapping(
  customizations: Record<string, string>,
  story: BibleStory,
  schema: CustomizationSchema,
  mapping: SymbolTheologyMapping
): { valid: boolean; errors: string[] } {
  const errors: string[] = [
    ...checkPreservesCore(customizations, story, schema),
    ...checkDoesNotChangeDoctrine(customizations),
    ...checkSymbolicIntegrity(customizations, story, mapping),
  ];

  return { valid: errors.length === 0, errors };
}

function getStoryFieldValue(
  story: BibleStory,
  fieldPath: string
): string | undefined {
  if (fieldPath === 'setting') return story.setting.environment;
  if (fieldPath === 'timePeriod') return story.timePeriod;
  if (fieldPath === 'character.name') {
    return story.characters[0]?.name;
  }
  if (fieldPath === 'character.role') {
    return story.characters[0]?.role;
  }
  return undefined;
}

export { DOCTRINAL_DENYLIST, DOCTRINAL_DENYLIST as doctrinalDenylist };
