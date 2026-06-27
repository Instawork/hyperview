import { useNode } from '@craftjs/core';

interface Props {
  label?: string;
  variant?: string;
  size?: string;
  state?: string;
  status?: string;
  icon?: string;
  iconTrailing?: boolean;
  action?: string;
  href?: string;
  target?: string;
  verb?: string;
  labelLoading?: string;
  hide?: boolean;
  hvId?: string;
}

export function MdsButton({
  label = 'Button', variant = 'primary', size = 'large',
  state = 'enabled', status = 'default', icon, iconTrailing = false,
  hide = false,
}: Props) {
  const { connectors: { connect, drag } } = useNode();

  const isDestructive = status === 'destructive';
  const bgMap: Record<string, string> = {
    primary: isDestructive ? 'bg-red-600' : 'bg-indigo-600',
    secondary: 'bg-gray-200',
    tertiary: 'bg-transparent border border-gray-500',
  };
  const textMap: Record<string, string> = {
    primary: 'text-white',
    secondary: isDestructive ? 'text-red-600' : 'text-gray-800',
    tertiary: isDestructive ? 'text-red-400' : 'text-indigo-400',
  };
  const sizeMap: Record<string, string> = {
    small: 'px-3 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  };

  const iconEl = icon ? (
    <span className="text-xs opacity-70">{icon}</span>
  ) : null;

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`rounded-lg font-semibold text-center cursor-move flex items-center justify-center gap-1.5 ${bgMap[variant] || bgMap.primary} ${textMap[variant] || textMap.primary} ${sizeMap[size] || sizeMap.large} ${state === 'disabled' ? 'opacity-40' : ''} ${state === 'loading' ? 'animate-pulse' : ''} ${hide ? 'opacity-20' : ''}`}
    >
      {!iconTrailing && iconEl}
      {state === 'loading' ? (
        <span className="text-xs">Loading...</span>
      ) : label}
      {iconTrailing && iconEl}
    </div>
  );
}

MdsButton.craft = {
  displayName: 'MDS Button',
  rules: { canMoveIn: () => false },
};
