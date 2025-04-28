import type { HvComponentProps, LocalName } from 'hyperview';
import Hyperview from 'hyperview';

const namespaceURI = 'https://hyperview.org/navigation';

const Header = (props: HvComponentProps) => {
  return (Hyperview.renderChildren(
    props.element,
    props.stylesheets,
    props.onUpdate,
    props.options,
  ) as unknown) as JSX.Element;
};

Header.namespaceURI = namespaceURI;
Header.localName = 'header' as LocalName;
Header.localNameAliases = [] as LocalName[];

export { Header };
