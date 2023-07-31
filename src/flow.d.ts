// Type definitions for mapping Flow types to TypeScript
// Project: flow-to-typescript-codemod
import type React from 'react';

type SetComplement<A, B extends A> = A extends B ? never : A;

export declare namespace Flow {
  // Abstract Component utility type
  // https://flow.org/en/docs/react/types/#toc-react-abstractcomponent
  type AbstractComponent<Config, Instance = any> = React.ComponentType<
    React.PropsWithoutRef<Config> & React.RefAttributes<Instance>
  >;

  // Class utility type
  // https://flow.org/en/docs/types/utilities/#toc-class
  // https://github.com/piotrwitek/utility-types/blob/df2502ef504c4ba8bd9de81a45baef112b7921d0/src/utility-types.ts#L158
  type Class<T> = new (...args: any[]) => T;

  // $Diff utility type
  // https://flow.org/en/docs/types/utilities/#toc-diff
  // https://github.com/piotrwitek/utility-types/blob/df2502ef504c4ba8bd9de81a45baef112b7921d0/src/utility-types.ts#L50
  type Diff<T extends U, U extends object> = Pick<
    T,
    SetComplement<keyof T, keyof U>
  >;

  type ObjMap<
    O extends Record<string, any>,
    F extends (...args: any[]) => any
  > = { [P in keyof O]: ReturnType<F> };
}
