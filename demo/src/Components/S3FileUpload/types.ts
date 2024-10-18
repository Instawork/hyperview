import * as CameraPicker from './pickers/camera';
import * as DocumentPicker from './pickers/document';
import type { ElementRef } from 'react';

export type DocumentPickerOptions = {
  type: string | undefined | null;
};

export enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
}

export type ImagePickerOptions = {
  mediaType: MediaType;
  maxWidth: number | undefined;
  maxHeight: number | undefined;
  includeBase64: boolean | undefined;
};

export type ImagePickerErrorCode =
  | 'camera_unavailable'
  | 'permission'
  | 'other';

export type ImagePickerAssetObject = {
  uri: string | undefined;
  fileSize: number | undefined;
  width: number | undefined;
  height: number | undefined;
  type: string | undefined;
  fileName: string | undefined;
};

export type CameraPickerResponse = {
  uri: string | undefined;
  width: number | undefined;
  height: number | undefined;
};

export type CameraFlashMode = number | string;

export type CameraType = number | string;

export type ImagePickerResponse = {
  didCancel: boolean | undefined;
  errorCode: ImagePickerErrorCode | undefined;
  assets: Array<ImagePickerAssetObject> | undefined;
};

export type DocumentPickerResponse = {
  name: string | undefined;
  size: number | undefined;
  type: string | undefined;
  uri: string | undefined;
};

export type PickerResponse = {
  fileName: string | undefined;
  fileSize: number | null | undefined;
  type: string | undefined;
  uri: string | undefined;
};

export enum Picker {
  CAMERA = 'camera',
  DOCUMENT = 'document',
  IMAGE = 'image',
}

export type PickerParams = {
  fileType: string | null;
  picker: Picker | null;
  maxHeight: number | null;
  maxWidth: number | null;
};

export type UsePicker = {
  camera: ElementRef<typeof CameraPicker.View> | null;
  document: ElementRef<typeof DocumentPicker.View> | null;
  fileResult: PickerResponse | null;
  isPickerError: boolean;
  isPicking: boolean;
  picker: Picker | null;
  setCamera: (ref: ElementRef<typeof CameraPicker.View>) => void;
  setDocument: (ref: ElementRef<typeof DocumentPicker.View>) => void;
  setIsPicking: (isPicking: boolean) => void;
  setPicker: (picker: Picker | null) => void;
  resetFileResult: () => void;
  earlyCancelRef: { current: boolean };
};

export type UploadParams = {
  data: {
    attributes: {
      /* eslint-disable camelcase */
      file_url: string;
      upload_url: string;
      upload_fields: Record<string, string>;
      /* eslint-enable camelcase */
    };
  };
};

export type UseUploadParams = {
  uploadParams: UploadParams | null;
  uploadParamsError: string;
  resetParams: () => void;
};
