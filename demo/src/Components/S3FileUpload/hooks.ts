import * as CameraPicker from './pickers/camera';
import * as DocumentPicker from './pickers/document';
import * as Errors from './errors';
import * as ImagePicker from './pickers/image';
import * as str from './strings';
import type {
  CameraPickerResponse,
  DocumentPickerOptions,
  DocumentPickerResponse,
  ImagePickerOptions,
  ImagePickerResponse,
  PickerParams,
  PickerResponse,
  UploadParams,
  UsePicker,
  UseUploadParams,
} from './types';
import { MediaType, Picker } from './types';
import { useEffect, useRef, useState } from 'react';
import type { ElementRef } from 'react';
import { Events } from 'hyperview';

const convertImagePickerResponse = (
  response: ImagePickerResponse,
): PickerResponse => ({
  fileName: response.assets?.[0].fileName,
  fileSize: response.assets?.[0].fileSize,
  type: response.assets?.[0].type,
  uri: response.assets?.[0].uri,
});

const convertDocumentPickerResponse = (
  response: DocumentPickerResponse,
): PickerResponse => ({
  fileName: response.name,
  fileSize: response.size,
  type: response.type,
  uri: response.uri,
});

const convertCameraPickerResponse = (
  response: CameraPickerResponse,
): PickerResponse => ({
  fileName: response.uri?.split('/').pop(),
  fileSize: null,
  type: 'image/jpeg',
  uri: response.uri,
});

/**
 * React hook to show the file or image picker.
 */
export const usePicker = (params: PickerParams): UsePicker => {
  const [fileResult, setFileResult] = useState<PickerResponse | null>(null);
  const [picker, setPicker] = useState<Picker | null>(params.picker);
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [isPickerError, setIsPickerError] = useState<boolean>(false);
  const [camera, setCamera] = useState<ElementRef<
    typeof CameraPicker.View
  > | null>(null);
  const [document, setDocument] = useState<ElementRef<
    typeof DocumentPicker.View
  > | null>(null);
  const earlyCancelRef = useRef<boolean>(false);

  useEffect(() => {
    async function pick() {
      if (!isPicking) {
        return;
      }
      if (picker === Picker.DOCUMENT) {
        const options: DocumentPickerOptions = {
          type: DocumentPicker.types.allFiles,
        };
        if (
          params.fileType !== null &&
          Object.values(DocumentPicker.types).length > 0
        ) {
          if (!DocumentPicker.types[params.fileType]) {
            throw new Errors.S3FileUploadUnknownFileTypeError(
              params.fileType,
              Object.values(DocumentPicker.types).map(t => String(t)),
            );
          }
          options.type = DocumentPicker.types[params.fileType];
        }
        try {
          if (document) {
            const response: DocumentPickerResponse = await document.pickSingle(
              options,
            );
            setFileResult(convertDocumentPickerResponse(response));
            setIsPicking(false);
          }
        } catch (err) {
          setIsPicking(false);
          if (!DocumentPicker.isCancel(err)) {
            setIsPickerError(true);
          }
        }
      } else if (picker === Picker.IMAGE) {
        const options: Partial<ImagePickerOptions> = {
          includeBase64: false,
          mediaType: MediaType.PHOTO,
        };
        if (params.fileType === MediaType.VIDEO) {
          options.mediaType = MediaType.VIDEO;
        }
        if (params.maxHeight !== null) {
          options.maxHeight = params.maxHeight;
        }
        if (params.maxWidth !== null) {
          options.maxWidth = params.maxWidth;
        }
        try {
          earlyCancelRef.current = false;
          const response: ImagePickerResponse = await ImagePicker.launchImageLibrary(
            options,
          );
          if (response.didCancel || earlyCancelRef.current) {
            setIsPicking(false);
          } else if (!response?.assets?.[0]?.fileName) {
            throw new Errors.S3FileUploadImagePermissionError();
          } else {
            setIsPicking(false);
            setFileResult(convertImagePickerResponse(response));
          }
        } catch (err) {
          setIsPickerError(true);
          setIsPicking(false);
        }
      } else if (picker === Picker.CAMERA) {
        try {
          if (camera) {
            if (params.fileType === MediaType.VIDEO) {
              throw new Errors.S3FileUploadNotImplementedError();
            } else {
              const response = await CameraPicker.takePictureAsync({});
              setIsPicking(false);
              setFileResult(convertCameraPickerResponse(response));
              setPicker(null);
            }
          } else {
            throw new Errors.S3FileUploadCameraNotSetError();
          }
        } catch (err) {
          setIsPickerError(true);
          setIsPicking(false);
        }
      } else {
        throw new Errors.S3FileUploadUnknownPickerError();
      }
    }
    pick();
  }, [
    camera,
    document,
    isPicking,
    picker,
    params.fileType,
    params.maxHeight,
    params.maxWidth,
  ]);

  const resetFileResult = () => {
    setFileResult(null);
    setIsPicking(false);
    setIsPickerError(false);
  };

  return {
    camera,
    document,
    earlyCancelRef,
    fileResult,
    isPickerError,
    isPicking,
    picker,
    resetFileResult,
    setCamera,
    setDocument,
    setIsPicking,
    setPicker,
  };
};

/**
 * React hook to get the S3 upload params from our backend
 * when the file is selected.
 */
export const useUploadParams = (
  policyUrl: string | null,
  dest: string | null,
  fileResult: PickerResponse | null,
): UseUploadParams => {
  const [uploadParams, setUploadParams] = useState<UploadParams | null>(null);
  const [uploadParamsError, setUploadParamsError] = useState<string>('');

  useEffect(() => {
    if (!fileResult) {
      return undefined;
    }
    if (!policyUrl) {
      return undefined;
    }
    if (!dest) {
      return undefined;
    }

    const formData = new FormData();
    formData.append('dest', dest);
    if (fileResult?.fileName) {
      formData.append('name', fileResult?.fileName);
    }
    if (fileResult?.type) {
      formData.append('type', fileResult?.type);
    }
    if (fileResult?.fileSize) {
      formData.append('size', fileResult?.fileSize?.toString());
    }

    // Using XHR instead of fetch because XHR can be aborted
    // when component unmounts or file changes.
    const req = new XMLHttpRequest();
    req.open('POST', policyUrl);
    req.onreadystatechange = () => {
      if (req.readyState === XMLHttpRequest.DONE) {
        const { status } = req;
        if (status === 0 || (status >= 200 && status < 300)) {
          try {
            setUploadParams(JSON.parse(req.responseText));
            setUploadParamsError('');
          } catch (err) {
            setUploadParams(null);
            setUploadParamsError(str.defaultUploadError());
          }
        } else {
          try {
            const errorMsg = JSON.parse(req.responseText).errors[0].detail;
            setUploadParamsError(errorMsg);
          } catch (err) {
            setUploadParamsError(str.defaultUploadError());
          }
        }
      }
    };
    setUploadParams(null);
    setUploadParamsError('');
    req.send(formData);

    // When uploadParams or fileResult changes,
    // abort the current upload request.
    return () => {
      req.abort();
    };
  }, [policyUrl, dest, fileResult]);

  const resetParams = () => {
    setUploadParams(null);
    setUploadParamsError('');
  };

  return { resetParams, uploadParams, uploadParamsError };
};

/**
 * React hook to upload file to S3 when the file and S3 upload params
 * are present.
 */
export const useUploader = (
  uploadParams: UploadParams | null,
  fileResult: PickerResponse | null,
): {
  isUploadError: boolean;
  isUploaded: boolean;
  progress: number;
  resetUpload: () => void;
} => {
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isUploadError, setIsUploadError] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // When uploadParams and fileResult are both set,
  // make a POST request to S3 to upload the file.
  useEffect(() => {
    if (!uploadParams) {
      return undefined;
    }
    if (!fileResult) {
      return undefined;
    }

    const uploadUrl = uploadParams.data.attributes.upload_url;
    const uploadFields = uploadParams.data.attributes.upload_fields;
    const uploadFormData = new FormData();
    Object.keys(uploadFields).forEach(key =>
      uploadFormData.append(key, uploadFields[key]),
    );
    uploadFormData.append('file', {
      name: fileResult?.fileName,
      type: fileResult?.type,
      uri: fileResult?.uri,
    });

    // Using XHR instead of fetch because:
    // - XHR has callbacks for progress, we need this to render the progress bar.
    // - XHR requests can be aborted (when file changes or component unmounts).
    const req = new XMLHttpRequest();
    req.open('POST', uploadUrl);

    req.upload.onprogress = e => {
      const percent = e.loaded / e.total;
      setProgress(percent);
    };
    req.addEventListener('error', () => {
      setIsUploadError(true);
      setIsUploaded(false);
    });
    req.onreadystatechange = () => {
      if (req.readyState === XMLHttpRequest.DONE) {
        const { status } = req;
        if (status === 0 || (status >= 200 && status < 300)) {
          setIsUploaded(true);
          setIsUploadError(false);
        } else {
          setIsUploaded(false);
          setIsUploadError(true);
        }
      }
    };

    setIsUploaded(false);
    setIsUploadError(false);
    req.send(uploadFormData);

    // When uploadParams or fileResult changes,
    // abort the current upload request.
    return () => {
      req.abort();
    };
  }, [uploadParams, fileResult]);

  const resetUpload = () => {
    setIsUploaded(false);
    setIsUploadError(false);
    setProgress(0);
  };

  return { isUploaded, isUploadError, progress, resetUpload };
};

/**
 * Adds an event listener to Hyperview's global event
 * emitter. Handles unsubscribing when the event name/handler changes or component unmounts.
 */
export const useEventListener = (
  eventName: string | null,
  handler: () => void,
) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const savedHandler = useRef<() => void>(() => {});
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!eventName) {
      return undefined;
    }
    const eventListener = (e: string | null) => {
      if (e === eventName) {
        savedHandler.current();
      }
    };
    Events.subscribe(eventListener);

    return () => {
      Events.unsubscribe(eventListener);
    };
  }, [eventName, handler]);
};
