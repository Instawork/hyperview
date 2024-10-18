import strings from './strings.json';

const t = (key: string): string => {
  return (strings as Record<string, string>)[key] || key;
};

export const cancel = (): string => t('cancel');
export const ok = (): string => t('ok');
export const askPermissionTitle = (): string => t('askPermissionTitle');
export const defaultUploadError = (): string => t('defaultUploadError');
