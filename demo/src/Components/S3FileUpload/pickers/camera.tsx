// import { RNCamera } from 'react-native-camera';

import * as Errors from '../errors';
import type { PropsWithChildren } from 'react';
import { View as RNView } from 'react-native';
import React from 'react';

export const Constants = {
  FlashMode: {
    auto: 'auto',
    off: 'off',
    on: 'on',
  },
  Type: {
    auto: 'auto',
    back: 'back',
    front: 'front',
  },
};

type Props = PropsWithChildren & {
  ref: React.Ref<unknown>;
  captureAudio: boolean | undefined;
  flashMode: number | string | undefined;
  mirrorImage: boolean | undefined;
  style: unknown | undefined;
  type: number | string | undefined;
};

export const View = (p: Props) => <RNView {...p} />;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const takePictureAsync = async (options: unknown) => {
  throw new Errors.S3FileUploadNotImplementedError();
};
