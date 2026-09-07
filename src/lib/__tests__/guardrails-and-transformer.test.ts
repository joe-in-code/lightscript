import {
  storiesCatalog,
  customizationSchema,
  symbolTheologyMapping,
} from '../../data/stories';
import {
  validateCustomizations,
  validateCustomizationsWithMapping,
  doctrinalDenylist,
} from '../guardrails';
import { transformStory } from '../transformer';
import type { BibleStory } from '../../types';

const davidStory = storiesCatalog.find(
  (s) => s.id === 'david-and-goliath'
) as BibleStory;
const prodigalStory = storiesCatalog.find(
  (s) => s.id === 'the-prodigal-son'
) as BibleStory;
const danielStory = storiesCatalog.find(
  (s) => s.id === 'daniel-lions-den'
) as BibleStory;

describe('validateCustomizations', () => {
  describe('preserves-core', () => {
    it('passes for valid surface customizations', () => {
      const customizations = {
        heroName: 'Ethan',
        setting: 'a quiet village beside olive groves',
      };
      const result = validateCustomizations(
        customizations,
        davidStory,
        customizationSchema
      );
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects when coreTheme is targeted via customization key', () => {
      const customizations = {
        heroName: 'David',
        coreTheme: 'Changed theme',
      };
      const result = validateCustomizations(
        customizations,
        davidStory,
        customizationSchema
      );
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('coreTheme'))).toBe(true);
    });

    it('rejects when theologicalMeaning is targeted via customization key', () => {
      const customizations = {
        heroName: 'David',
        theologicalMeaning: 'New meaning',
      };
      const result = validateCustomizations(
        customizations,
        davidStory,
        customizationSchema
      );
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('theologicalMeaning'))).toBe(
        true
      );
    });

    it('rejects when doctrineTags is targeted via customization key', () => {
      const customizations = {
        heroName: 'David',
        doctrineTags: 'new-tag',
      };
      const result = validateCustomizations(
        customizations,
        davidStory,
        customizationSchema
      );
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('doctrineTags'))).toBe(true);
    });

    it('rejects when core field is referenced in customization value', () => {
      const customizations = {
        heroName: 'theologicalMeaning',
      };
      const result = validateCustomizations(
        customizations,
        davidStory,
        customizationSchema
      );
      expect(result.valid).toBe(false);
      expect(
        result.errors.some((e) => e.includes('protected doctrinal field'))
      ).toBe(true);
    });
  });

  describe('does-not-change-doctrine', () => {
    it('rejects sin -> good inversion', () => {
      const customizations = {
        heroName: 'Good',
      };
      const result = validateCustomizations(
        customizations,
        davidStory,
        customizationSchema
      );
      expect(result.valid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.includes('sin') && e.includes('doctrinal inversion')
        )
      ).toBe(true);
    });

    it('rejects sacrifice -> transaction inversion', () => {
      const customizations = {
        heroRole: 'a transaction of works',
      };
      const result = validateCustomizations(
        customizations,
        prodigalStory,
        customizationSchema
      );
      expect(result.valid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.includes('sacrifice') && e.includes('doctrinal inversion')
        )
      ).toBe(true);
    });

    it('rejects faith -> works-only inversion', () => {
      const customizations = {
        heroRole: 'a works-only advocate',
      };
      const result = validateCustomizations(
        customizations,
        davidStory,
        customizationSchema
      );
      expect(result.valid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.includes('works-only') && e.includes('doctrinal inversion')
        )
      ).toBe(true);
    });

    it('rejects condemnation used in place of forgiveness', () => {
      const customizations = {
        tone: 'condemnation instead of forgiveness',
      };
      const result = validateCustomizations(
        customizations,
        davidStory,
        customizationSchema
      );
      expect(result.valid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.includes('forgiveness') && e.includes('doctrinal inversion')
        )
      ).toBe(true);
    });

    it('rejects redemption -> condemnation inversion', () => {
      const customizations = {
        heroName: 'Condemned',
      };
      const result = validateCustomizations(
        customizations,
        davidStory,
        customizationSchema
      );
      expect(result.valid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.includes('condemned') && e.includes('doctrinal inversion')
        )
      ).toBe(true);
    });

    it('accepts valid surface-level customizations', () => {
      const customizations = {
        heroName: 'Jonathan',
        setting: 'a quiet village beside olive groves',
        timePeriod:
          'under the reign of a great king who tested the hearts of men',
        heroRole: 'a faithful witness who will not compromise',
        tone: 'hopeful and triumphant',
        symbol1: 'the bloodied wounds',
      };
      const result = validateCustomizationsWithMapping(
        customizations,
        prodigalStory,
        customizationSchema,
        symbolTheologyMapping
      );
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('symbolic-integrity', () => {
    it('accepts a symbol with a mapping in the theology dictionary', () => {
      const customizations = {
        symbol1: 'the oil and wine',
      };
      const result = validateCustomizationsWithMapping(
        customizations,
        davidStory,
        customizationSchema,
        symbolTheologyMapping
      );
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts the original symbol (no change)', () => {
      const customizations = {
        symbol1: davidStory.keySymbols[0],
      };
      const result = validateCustomizationsWithMapping(
        customizations,
        davidStory,
        customizationSchema,
        symbolTheologyMapping
      );
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects a symbol with no mapping and no theological overlap', () => {
      const customizations = {
        symbol1: 'a rubber duck',
      };
      const result = validateCustomizationsWithMapping(
        customizations,
        davidStory,
        customizationSchema,
        symbolTheologyMapping
      );
      expect(result.valid).toBe(false);
      expect(
        result.errors.some((e) => e.includes('Symbolic-integrity violation'))
      ).toBe(true);
    });

    it('rejects a symbol with no known theological mapping', () => {
      const customizations = {
        symbol1: 'the bloodied wounds',
      };
      const result = validateCustomizationsWithMapping(
        customizations,
        davidStory,
        customizationSchema,
        {}
      );
      expect(result.valid).toBe(false);
      expect(
        result.errors.some((e) => e.includes('Symbolic-integrity violation'))
      ).toBe(true);
    });
  });

  it('accumulates errors from multiple guardrails', () => {
    const customizations = {
      coreTheme: 'Changed',
      heroName: 'Good',
    };
    const result = validateCustomizations(
      customizations,
      davidStory,
      customizationSchema
    );
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });
});

describe('transformStory', () => {
  it('substitutes placeholders in the narrative template', () => {
    const customizations = {
      heroName: 'Ethan',
      setting: 'a quiet village beside olive groves',
      timePeriod:
        'under the reign of a great king who tested the hearts of men',
      heroRole: 'a faithful witness who will not compromise',
      symbol1: 'a staff carved from olive wood',
    };
    const result = transformStory(
      davidStory,
      customizations,
      customizationSchema
    );
    expect(result.narrative).toContain('Ethan');
    expect(result.narrative).toContain('a quiet village beside olive groves');
    expect(result.narrative).toContain('a staff carved from olive wood');
  });

  it('falls back to story values for uncustomized fields', () => {
    const customizations = {
      heroName: 'Ethan',
    };
    const result = transformStory(
      davidStory,
      customizations,
      customizationSchema
    );
    const envFallback = davidStory.setting.environment;
    expect(result.narrative).toContain('Ethan');
    expect(
      envFallback.includes('socoh') || result.narrative.includes(envFallback)
    ).toBe(true);
  });

  it('records AppliedModification entries for each changed field', () => {
    const customizations = {
      heroName: 'Ethan',
      setting: 'a quiet village beside olive groves',
    };
    const result = transformStory(
      davidStory,
      customizations,
      customizationSchema
    );
    const modificationFields = result.modifications.map((m) => m.field);
    expect(modificationFields).toContain('heroName');
    expect(modificationFields).toContain('setting');
    expect(
      result.modifications.find((m) => m.field === 'heroName')?.original
    ).toBe(davidStory.characters[0]?.name);
    expect(
      result.modifications.find((m) => m.field === 'heroName')?.replacement
    ).toBe('Ethan');
  });

  it('preserves story arc and doctrinal terms verbatim', () => {
    const customizations = {
      heroName: 'Ethan',
      setting: 'a quiet village beside olive groves',
    };
    const result = transformStory(
      davidStory,
      customizations,
      customizationSchema
    );
    expect(result.narrative).not.toMatch(/\{\{/);
    expect(result.narrative).toContain('Lord');
    expect(result.narrative).toContain('faith');
  });

  it('returns a readable narrative with no unresolved placeholders', () => {
    const customizations = {
      heroName: 'Ethan',
      setting: 'a quiet village beside olive groves',
      timePeriod:
        'under the reign of a great king who tested the hearts of men',
      heroRole: 'a faithful witness who will not compromise',
      symbol1: 'a staff carved from olive wood',
    };
    const result = transformStory(
      davidStory,
      customizations,
      customizationSchema
    );
    expect(result.narrative).not.toMatch(/\{\{/);
    expect(result.narrative.length).toBeGreaterThan(100);
  });

  it('includes the tone customization in modifications even if not in template', () => {
    const customizations = {
      heroName: 'Ethan',
      tone: 'solemn and reflective',
    };
    const result = transformStory(
      davidStory,
      customizations,
      customizationSchema
    );
    expect(
      result.modifications.some(
        (m) => m.field === 'tone' && m.replacement === 'solemn and reflective'
      )
    ).toBe(true);
  });
});
