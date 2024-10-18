/* eslint-disable max-classes-per-file */

export class S3FileUploadUnknownPickerError extends Error {
  name = 'S3FileUploadUnknownPickerError';

  constructor() {
    super(`Unknown value for "picker" attribute`);
  }
}

export class S3FileUploadUnknownFileTypeError extends Error {
  name = 'S3FileUploadUnknownFileTypeError';

  constructor(fileType: string, supportedTypes: string[]) {
    super(
      `Unknown value ${fileType} for "file-type" attribute, should be one of [${supportedTypes.join(
        ',',
      )}]`,
    );
  }
}

export class S3FileUploadImagePermissionError extends Error {
  name = 'S3FileUploadImagePermissionError';

  constructor() {
    super('Permission to access camera roll was not granted');
  }
}

export class S3FileUploadCameraNotSetError extends Error {
  name = 'S3FileUploadCameraNotSetError';

  constructor() {
    super('Missing camera picker');
  }
}

export class S3FileUploadNotImplementedError extends Error {
  name = 'S3FileUploadNotImplementedError';

  constructor() {
    super('Not implemented');
  }
}
