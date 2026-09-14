export interface HvElementProps {
  id?: string;
  style?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export const HYPERVIEW_NS = 'https://hyperview.org/hyperview';

export const ELEMENT_CATEGORIES = {
  Structure: ['HvDoc', 'HvScreen', 'HvBody', 'HvHeader'],
  Layout: ['HvView'],
  Content: ['HvText', 'HvImage', 'HvSpinner'],
  Lists: ['HvList', 'HvItem'],
  Forms: ['HvForm', 'HvTextField', 'HvSelectSingle', 'HvOption', 'HvSwitch'],
} as const;

export interface ElementDefinition {
  tagName: string;
  displayName: string;
  category: string;
  canContain: string[] | '*';
  canBeContainedIn: string[] | '*';
  defaultProps: Record<string, string>;
  editableProps: PropDefinition[];
}

export interface PropDefinition {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'color' | 'boolean';
  options?: string[];
  group?: string;
}
