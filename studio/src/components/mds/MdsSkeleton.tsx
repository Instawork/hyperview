import { useNode } from '@craftjs/core';

interface Props {
  variant?: string;
  size?: string;
  hvId?: string;
}

export function MdsSkeleton({ variant = 'text', size }: Props) {
  const { connectors: { connect, drag } } = useNode();

  const variantClasses: Record<string, string> = {
    text: 'h-3 w-full rounded',
    icon: 'h-6 w-6 rounded',
    avatar: 'h-10 w-10 rounded-full',
    filter: 'h-8 w-20 rounded-full',
  };

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`bg-gray-700 animate-pulse cursor-move ${variantClasses[variant] || variantClasses.text}`}
      style={size ? { width: size, height: size } : undefined}
      title={`skeleton: ${variant}`}
    />
  );
}

MdsSkeleton.craft = {
  displayName: 'MDS Skeleton',
  rules: { canMoveIn: () => false },
};
