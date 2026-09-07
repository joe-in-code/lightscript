export type Location = {
  id: string;
  name: string;
  region: string;
  description: string;
};

export type Setting = {
  location: Location;
  environment: string;
  description: string;
};

export type Character = {
  id: string;
  name: string;
  role: string;
  symbolMeaning: string;
};

export type Theme = {
  id: string;
  name: string;
  description: string;
};

export type BibleStory = {
  id: string;
  title: string;
  reference: string;
  description: string;
  characters: Character[];
  setting: Setting;
  timePeriod: string;
  coreTheme: string;
  theologicalMeaning: string;
  keySymbols: string[];
  doctrineTags: string[];
  narrative: string;
};

export type CustomizationType = 'text' | 'select' | 'textarea';

export type Guardrail =
  'preserves-core' | 'does-not-change-doctrine' | 'symbolic-integrity';

export type CustomizationOption = {
  id: string;
  label: string;
  type: CustomizationType;
  storyField: string;
  guardrail: Guardrail;
  options?: string[];
};

export type CustomizationSchema = CustomizationOption[];

export type AppliedModification = {
  field: string;
  original: string;
  replacement: string;
};

export type TransformResult = {
  narrative: string;
  modifications: AppliedModification[];
};

export type SymbolTheologyMapping = Record<string, string>;

export type CustomizationValues = Record<string, string>;
