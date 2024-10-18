// import * as ImagePicker from 'react-native-image-picker';

import * as Errors from '../errors';
import type { ImagePickerOptions, ImagePickerResponse } from '../types';

const ImagePicker = {};

export const launchImageLibrary = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: Partial<ImagePickerOptions>,
): Promise<ImagePickerResponse> => {
  throw new Errors.S3FileUploadNotImplementedError();
};

export default ImagePicker;
