export const MDS_NS = 'https://instawork.com/hyperview-mds';
export const WORKER_APP_NS = 'https://instawork.com/hyperview-worker-app';
export const UI_NS = 'https://instawork.com/hyperview-ui';
export const ICON_NS = 'https://instawork.com/hyperview-icon';
export const NAV_NS = 'https://instawork.com/hyperview-nav';

export const MDS_VARIANTS = ['primary', 'secondary', 'tertiary'] as const;
export const MDS_BUTTON_STATUSES = ['default', 'destructive'] as const;
export const MDS_STATES = ['enabled', 'disabled', 'loading'] as const;
export const MDS_SIZES = ['small', 'medium', 'large'] as const;
export const MDS_VERBS = ['get', 'post'] as const;

export const MDS_ALERT_KINDS = ['success', 'danger', 'info', 'neutral', 'warning'] as const;
export const MDS_BANNER_TYPES = ['WARNING', 'SUCCESS', 'PRIMARY', 'DANGER'] as const;
export const MDS_DIALOG_STYLES = ['default', 'cancel', 'destructive'] as const;
export const MDS_LAYOUTS = ['none', 'horizontal', 'vertical'] as const;

export const MDS_AVATAR_SIZES = ['24', '32', '40', '48', '56', '64', '72', '96', '128'] as const;
export const MDS_AVATAR_TYPES = ['person', 'business'] as const;

export const MDS_ICON_SIZES = ['8', '12', '16', '20', '24', '32', '36', '40', '48', '64', '80', '96', '128', '196'] as const;

export const MDS_TEXT_TYPES = ['b2', 'b3', 'b4', 'b5', 'b6', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'] as const;
export const MDS_FONT_STYLES = ['normal', 'italic'] as const;
export const MDS_TEXT_ALIGNS = ['auto', 'left', 'right', 'center', 'justify'] as const;
export const MDS_LIST_TYPES = ['unordered', 'ordered', 'ordered_simple'] as const;

export const MDS_SKELETON_VARIANTS = ['text', 'icon', 'avatar', 'filter'] as const;
export const MDS_TOAST_TYPES = ['positive', 'negative', 'neutral'] as const;

export const MDS_CAROUSEL_PAGINATIONS = ['hide', 'overlay'] as const;

export interface DialogOptionDef {
  label: string;
  style: string;
}

export interface AlertLinkDef {
  label: string;
}

export const SLOT_DEFS: Record<string, { id: string; label: string }[]> = {
  MdsListItem: [
    { id: 'left', label: 'Left' },
    { id: 'content', label: 'Content' },
    { id: 'right', label: 'Right' },
    { id: 'bottom', label: 'Bottom' },
  ],
  MdsAlert: [
    { id: 'content', label: 'Content' },
  ],
  MdsTitlebar: [
    { id: 'leftContent', label: 'Left' },
    { id: 'rightContent', label: 'Right' },
  ],
  MdsBottomsheet: [
    { id: 'body', label: 'Body' },
    { id: 'ctaChildren', label: 'Primary CTA' },
    { id: 'secondaryCtaChildren', label: 'Secondary CTA' },
  ],
  MdsList: [
    { id: 'header', label: 'Header' },
    { id: 'itemTemplate', label: 'Item Template' },
    { id: 'footer', label: 'Footer' },
    { id: 'empty', label: 'Empty State' },
    { id: 'title', label: 'Title' },
  ],
};
