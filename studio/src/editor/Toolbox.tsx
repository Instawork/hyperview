import { useEditor, Element } from '@craftjs/core';
import {
  FileText, Layout, Type, Image, Loader2, List,
  FormInput, TextCursorInput, ToggleLeft, CheckSquare, CircleDot,
  PanelTop, Rows3, Calendar, ListChecks,
  Package, MousePointerClick, CreditCard, AlertTriangle, Star,
  Minus, Tag, PanelTopClose, ArrowDownFromLine, MessageSquare,
  CircleUser, ListTodo, Bone, Flag, SearchX,
  Layers, PanelBottomOpen, GalleryHorizontal, ListOrdered, TypeIcon,
} from 'lucide-react';
import { useState } from 'react';
import { HvView } from '../components/HvView';
import { HvText } from '../components/HvText';
import { HvImage } from '../components/HvImage';
import { HvSpinner } from '../components/HvSpinner';
import { HvHeader } from '../components/HvHeader';
import { HvList } from '../components/HvList';
import { HvItem } from '../components/HvItem';
import { HvForm } from '../components/HvForm';
import { HvTextField } from '../components/HvTextField';
import { HvSelectSingle } from '../components/HvSelectSingle';
import { HvSelectMultiple } from '../components/HvSelectMultiple';
import { HvOption } from '../components/HvOption';
import { HvSwitch } from '../components/HvSwitch';
import { HvDateField } from '../components/HvDateField';
import {
  MdsButton, MdsCard, MdsAlert, MdsIcon, MdsSeparator,
  MdsPill, MdsTitlebar, MdsFooter, MdsCallout, MdsAvatar,
  MdsListItem, MdsSkeleton, MdsBanner, MdsEmptyStatus,
  MdsDialog, MdsBottomsheet, MdsCarousel, MdsCarouselItem,
  MdsList, MdsText,
} from '../components/mds';

interface ToolboxCategory {
  name: string;
  items: { name: string; icon: React.ReactNode; element: React.ReactElement }[];
}

const categories: ToolboxCategory[] = [
  {
    name: 'Structure',
    items: [
      { name: 'Header', icon: <PanelTop size={16} />, element: <HvHeader /> },
    ],
  },
  {
    name: 'Layout',
    items: [
      { name: 'View', icon: <Layout size={16} />, element: <Element is={HvView} canvas /> },
    ],
  },
  {
    name: 'Content',
    items: [
      { name: 'Text', icon: <Type size={16} />, element: <HvText text="Text" /> },
      { name: 'Image', icon: <Image size={16} />, element: <HvImage /> },
      { name: 'Spinner', icon: <Loader2 size={16} />, element: <HvSpinner /> },
    ],
  },
  {
    name: 'Lists',
    items: [
      { name: 'List', icon: <List size={16} />, element: <Element is={HvList} canvas /> },
      { name: 'Item', icon: <Rows3 size={16} />, element: <Element is={HvItem} canvas /> },
    ],
  },
  {
    name: 'Forms',
    items: [
      { name: 'Form', icon: <FormInput size={16} />, element: <Element is={HvForm} canvas /> },
      { name: 'Text Field', icon: <TextCursorInput size={16} />, element: <HvTextField /> },
      { name: 'Date Field', icon: <Calendar size={16} />, element: <HvDateField /> },
      { name: 'Select', icon: <CheckSquare size={16} />, element: <Element is={HvSelectSingle} canvas /> },
      { name: 'Multi Select', icon: <ListChecks size={16} />, element: <Element is={HvSelectMultiple} canvas /> },
      { name: 'Option', icon: <CircleDot size={16} />, element: <HvOption /> },
      { name: 'Switch', icon: <ToggleLeft size={16} />, element: <HvSwitch /> },
    ],
  },
  {
    name: 'MDS Actions',
    items: [
      { name: 'Button', icon: <MousePointerClick size={16} />, element: <MdsButton /> },
      { name: 'Dialog', icon: <Layers size={16} />, element: <MdsDialog /> },
    ],
  },
  {
    name: 'MDS Layout',
    items: [
      { name: 'Card', icon: <CreditCard size={16} />, element: <Element is={MdsCard} canvas /> },
      { name: 'Titlebar', icon: <PanelTopClose size={16} />, element: <MdsTitlebar /> },
      { name: 'Footer', icon: <ArrowDownFromLine size={16} />, element: <Element is={MdsFooter} canvas /> },
      { name: 'Separator', icon: <Minus size={16} />, element: <MdsSeparator /> },
      { name: 'List Item', icon: <ListTodo size={16} />, element: <MdsListItem /> },
      { name: 'Bottomsheet', icon: <PanelBottomOpen size={16} />, element: <MdsBottomsheet /> },
      { name: 'List', icon: <ListOrdered size={16} />, element: <MdsList /> },
    ],
  },
  {
    name: 'MDS Feedback',
    items: [
      { name: 'Alert', icon: <AlertTriangle size={16} />, element: <MdsAlert /> },
      { name: 'Banner', icon: <Flag size={16} />, element: <MdsBanner /> },
      { name: 'Callout', icon: <MessageSquare size={16} />, element: <Element is={MdsCallout} canvas /> },
      { name: 'Empty Status', icon: <SearchX size={16} />, element: <Element is={MdsEmptyStatus} canvas /> },
      { name: 'Skeleton', icon: <Bone size={16} />, element: <MdsSkeleton /> },
    ],
  },
  {
    name: 'MDS Data Display',
    items: [
      { name: 'Avatar', icon: <CircleUser size={16} />, element: <MdsAvatar /> },
      { name: 'Icon', icon: <Star size={16} />, element: <MdsIcon /> },
      { name: 'Pill', icon: <Tag size={16} />, element: <MdsPill /> },
      { name: 'MDS Text', icon: <TypeIcon size={16} />, element: <MdsText /> },
      { name: 'Carousel', icon: <GalleryHorizontal size={16} />, element: <Element is={MdsCarousel} canvas /> },
      { name: 'Carousel Item', icon: <Package size={16} />, element: <Element is={MdsCarouselItem} canvas /> },
    ],
  },
];

function ToolboxItem({ name, icon, element }: { name: string; icon: React.ReactNode; element: React.ReactElement }) {
  const { connectors } = useEditor();

  return (
    <div
      ref={(ref) => { if (ref) connectors.create(ref, element); }}
      className="flex items-center gap-2 px-3 py-2 rounded cursor-grab hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
    >
      {icon}
      <span>{name}</span>
    </div>
  );
}

export function Toolbox() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (name: string) => {
    setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex flex-col gap-1 p-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] px-3 py-2 flex items-center gap-2">
        <FileText size={14} />
        Components
      </div>
      {categories.map((cat) => (
        <div key={cat.name}>
          <button
            onClick={() => toggle(cat.name)}
            className="w-full text-left px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {collapsed[cat.name] ? '▸' : '▾'} {cat.name}
          </button>
          {!collapsed[cat.name] && (
            <div className="ml-2">
              {cat.items.map((item) => (
                <ToolboxItem key={item.name} {...item} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
