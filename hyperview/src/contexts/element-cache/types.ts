export type Props = {
  setElement: (key: number, element: Element) => void;
  removeElement: (key: number) => void;
  getElement: (key: number) => Element | undefined;
};
