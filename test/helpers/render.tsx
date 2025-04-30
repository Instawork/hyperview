import Hyperview from 'hyperview/src';
import React from 'react';
import { read } from './file';

type Props = {
  paths: string[];
};

export const HyperviewMock = (props: Props) => {
  let index = 0;

  const fetch = async () => {
    if (index >= props.paths.length) {
      throw new Error('No more responses');
    }
    const response = read(props.paths[index]) || '';
    if (!response) {
      throw new Error(`Template not found: ${props.paths[index]}`);
    }
    index += 1;

    return {
      ok: true,
      text: async () => response,
    } as Response;
  };

  return (
    <Hyperview
      entrypointUrl="http://dummy"
      experimentalFeatures={{}}
      fetch={fetch}
      formatDate={() => ''}
    />
  );
};
