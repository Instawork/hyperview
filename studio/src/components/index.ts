export { HvDoc } from './HvDoc';
export { HvScreen } from './HvScreen';
export { HvBody } from './HvBody';
export { HvHeader } from './HvHeader';
export { HvView } from './HvView';
export { HvText } from './HvText';
export { HvImage } from './HvImage';
export { HvSpinner } from './HvSpinner';
export { HvList } from './HvList';
export { HvItem } from './HvItem';
export { HvForm } from './HvForm';
export { HvTextField } from './HvTextField';
export { HvSelectSingle } from './HvSelectSingle';
export { HvSelectMultiple } from './HvSelectMultiple';
export { HvOption } from './HvOption';
export { HvSwitch } from './HvSwitch';
export { HvDateField } from './HvDateField';

export const componentMap = {
  HvDoc: 'doc',
  HvScreen: 'screen',
  HvBody: 'body',
  HvHeader: 'header',
  HvView: 'view',
  HvText: 'text',
  HvImage: 'image',
  HvSpinner: 'spinner',
  HvList: 'list',
  HvItem: 'item',
  HvForm: 'form',
  HvTextField: 'text-field',
  HvSelectSingle: 'select-single',
  HvSelectMultiple: 'select-multiple',
  HvOption: 'option',
  HvSwitch: 'switch',
  HvDateField: 'date-field',
} as const;
