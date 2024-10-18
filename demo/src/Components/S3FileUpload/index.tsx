import * as CameraPicker from './pickers/camera';
import * as DocumentPicker from './pickers/document';
import type { CameraFlashMode, CameraType } from './types';
import Hyperview, { ACTIONS, NODE_TYPE } from 'hyperview';
import { Modal, SafeAreaView, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  useEventListener,
  usePicker,
  useUploadParams,
  useUploader,
} from './hooks';
import type { ElementRef } from 'react';
import type { HvComponentProps } from 'hyperview';
import { Picker } from './types';
import styles from './styles';

const NAMESPACE = 'https://instawork.com/hyperview-s3-file-upload';

const visitElements = (element: Element, callback: (e: Element) => void) => {
  callback(element);
  let node: Node | null = element.firstChild;
  while (node) {
    if (node.nodeType === NODE_TYPE.ELEMENT_NODE) {
      // We know the node is an element, so we can safely cast it.
      visitElements(node as Element, callback);
    }
    node = node.nextSibling;
  }
};

function getStateElement(element: Element, state: string): Element | undefined {
  return Array.from(element.childNodes).find(n => {
    if (n.nodeType === NODE_TYPE.ELEMENT_NODE) {
      // We know the node is an element, so we can safely cast it.
      return (n as Element).getAttributeNS(NAMESPACE, 'state') === state;
    }
    return false;
  }) as Element | undefined;
}

function getNumberAttr(
  attrName: string,
  element: Element,
  defaultValue: number | null = null,
): number | null {
  const value = element.getAttributeNS(NAMESPACE, attrName);
  if (!value) {
    return defaultValue;
  }
  return parseInt(value, 10);
}

/**
 * Finds the pre-populated file URL in the component. This is used
 * when rendering the component to edit an existing form.
 */
function getInitialUrl(element: Element): string | null {
  let url: string | null = null;
  visitElements(element, el => {
    const role = el.getAttributeNS(NAMESPACE, 'role');
    if (role === 'file-url-value') {
      if (el.getAttribute('value')) {
        url = el.getAttribute('value');
      }
    }
  });
  return url;
}

function getCameraType(cameraType: string | null): CameraType | undefined {
  if (cameraType === 'front') {
    return CameraPicker.Constants.Type.front;
  }
  if (cameraType === 'back') {
    return CameraPicker.Constants.Type.back;
  }
  return undefined;
}

function getCameraFlashMode(
  cameraFlashMode: string | null,
): CameraFlashMode | undefined {
  if (cameraFlashMode === 'on') {
    return CameraPicker.Constants.FlashMode.on;
  }
  if (cameraFlashMode === 'off') {
    return CameraPicker.Constants.FlashMode.off;
  }
  if (cameraFlashMode === 'auto') {
    return CameraPicker.Constants.FlashMode.auto;
  }
  return undefined;
}

export default function S3FileUpload(props: HvComponentProps) {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate } = props;
  const chooseEvent: string | null = element.getAttributeNS(
    NAMESPACE,
    'choose-event',
  );
  const chooseDocumentPickerEvent: string | null = element.getAttributeNS(
    NAMESPACE,
    'choose-document-picker-event',
  );
  const chooseImagePickerEvent: string | null = element.getAttributeNS(
    NAMESPACE,
    'choose-image-picker-event',
  );
  const chooseCameraPickerEvent: string | null = element.getAttributeNS(
    NAMESPACE,
    'choose-camera-picker-event',
  );
  const cameraCancelEvent: string | null = element.getAttributeNS(
    NAMESPACE,
    'camera-cancel-event',
  );
  const cameraCaptureEvent: string | null = element.getAttributeNS(
    NAMESPACE,
    'camera-capture-event',
  );
  const cameraTypeFrontEvent: string | null = element.getAttributeNS(
    NAMESPACE,
    'camera-type-front-event',
  );
  const cameraTypeBackEvent: string | null = element.getAttributeNS(
    NAMESPACE,
    'camera-type-back-event',
  );
  const cameraFlashModeOnEvent: string | null = element.getAttributeNS(
    NAMESPACE,
    'camera-flash-mode-on-event',
  );
  const cameraFlashModeOffEvent: string | null = element.getAttributeNS(
    NAMESPACE,
    'camera-flash-mode-off-event',
  );
  const cameraFlashModeAutoEvent: string | null = element.getAttributeNS(
    NAMESPACE,
    'camera-flash-mode-auto-event',
  );
  const cancelEvent: string | null = element.getAttributeNS(
    NAMESPACE,
    'cancel-event',
  );
  const retryEvent: string | null = element.getAttributeNS(
    NAMESPACE,
    'retry-event',
  );
  const policyUrl: string | null = element.getAttributeNS(
    NAMESPACE,
    'policy-url',
  );
  const picker: Picker =
    (element.getAttributeNS(NAMESPACE, 'picker') as Picker) || Picker.IMAGE;
  const fileType: string | null =
    element.getAttributeNS(NAMESPACE, 'file-type') || null;
  const dest: string | null = element.getAttributeNS(NAMESPACE, 'dest');
  const maxHeight: number | null = getNumberAttr('max-image-height', element);
  const maxWidth: number | null = getNumberAttr('max-image-width', element);

  const savedElement = useRef<Element>();
  const camera = useRef<ElementRef<typeof CameraPicker.View>>();
  const [cameraType, setCameraType] = useState<CameraType | undefined>(
    getCameraType(element.getAttributeNS(NAMESPACE, 'camera-type')),
  );
  const [cameraFlashMode, setCameraFlashMode] = useState<
    CameraFlashMode | undefined
  >(getCameraFlashMode(element.getAttributeNS(NAMESPACE, 'camera-flash-type')));

  const {
    fileResult,
    isPickerError,
    picker: currentPicker,
    setCamera,
    setDocument,
    isPicking,
    setIsPicking,
    setPicker,
    resetFileResult,
    earlyCancelRef,
  } = usePicker({
    fileType,
    maxHeight,
    maxWidth,
    picker,
  });
  const { uploadParams, uploadParamsError, resetParams } = useUploadParams(
    policyUrl,
    dest,
    fileResult,
  );
  const { isUploaded, isUploadError, progress, resetUpload } = useUploader(
    uploadParams,
    fileResult,
  );
  // Keeps track of the initial URL when the component is created for a filled-in form.
  const [initialUrl, setInitialUrl] = useState<string | null>(() =>
    getInitialUrl(element),
  );

  // Reset all hooks
  const resetState = () => {
    earlyCancelRef.current = true;
    resetUpload();
    resetParams();
    resetFileResult();
    setInitialUrl(null);
  };

  // Keep a reference to the current DOM element, so that we can mutate it in the UI
  // effect below.
  useEffect(() => {
    savedElement.current = element;
  }, [element]);

  // Update UI by modifying the DOM element. Find elements tagged with roles to fill in
  // file name, file URL, progress, etc.
  useEffect(() => {
    const fileName: string | null = fileResult?.fileName ?? '';
    const localUrl: string | null = fileResult?.uri ?? null;
    const remoteUrl: string | null = uploadParams
      ? uploadParams.data.attributes.file_url
      : null;

    const newElement = savedElement.current?.cloneNode(true) as Element;
    visitElements(newElement, el => {
      const currentEl: Element = el; // make eslint happy about not re-assigning params.
      const role: string | null = el.getAttributeNS(NAMESPACE, 'role');
      if (role === 'file-name-text') {
        currentEl.textContent = fileName;
      }
      if (role === 'file-name-value') {
        currentEl.setAttribute('value', fileName);
      }
      if (role === 'local-url-source' && localUrl) {
        const attribute =
          currentEl.getAttributeNS(NAMESPACE, 'source-attr') || 'source';
        currentEl.setAttribute(attribute, localUrl);
      }
      if (role === 'progress-value') {
        currentEl.setAttribute('value', String(progress));
      }
      if (role === 'progress-text') {
        currentEl.textContent = `${(100 * progress).toFixed(0)}`;
      }
      if (role === 'file-url-value') {
        if (isUploaded && remoteUrl) {
          currentEl.setAttribute('value', remoteUrl);
        } else if (initialUrl) {
          currentEl.setAttribute('value', initialUrl);
        } else {
          currentEl.removeAttribute('value');
        }
      }
      if (role === 'upload-error-text' && uploadParamsError) {
        currentEl.textContent = uploadParamsError;
      }
    });
    if (savedElement.current) {
      onUpdate(null, ACTIONS.SWAP, savedElement.current, { newElement });
    }
  }, [
    fileResult,
    initialUrl,
    isUploaded,
    onUpdate,
    progress,
    uploadParams,
    uploadParamsError,
  ]);

  // Open picker when getting the choose event.
  useEventListener(chooseEvent, () => {
    setIsPicking(true);
  });

  // Open specific picker when getting specific choose event.
  useEventListener(chooseDocumentPickerEvent, () => {
    setPicker(Picker.DOCUMENT);
    setIsPicking(true);
  });
  useEventListener(chooseImagePickerEvent, () => {
    setPicker(Picker.IMAGE);
    setIsPicking(true);
  });

  // Handle camera picker
  // The choose event only sets the picker, which opens the camera UI
  // The camera UI is then in charge of sending the event that will trigger
  // the "picking" state, which will trigger the capture.
  useEventListener(chooseCameraPickerEvent, () => {
    setCamera(camera);
    setPicker(Picker.CAMERA);
  });
  useEventListener(cameraCaptureEvent, () => {
    setIsPicking(true);
  });
  useEventListener(cameraCancelEvent, () => {
    setPicker(null);
    setCamera(null);
  });
  useEventListener(cameraTypeFrontEvent, () => {
    setCameraType(CameraPicker.Constants.Type.front);
  });
  useEventListener(cameraTypeBackEvent, () => {
    setCameraType(CameraPicker.Constants.Type.back);
  });
  useEventListener(cameraFlashModeOnEvent, () => {
    setCameraFlashMode(CameraPicker.Constants.FlashMode.on);
  });
  useEventListener(cameraFlashModeOffEvent, () => {
    setCameraFlashMode(CameraPicker.Constants.FlashMode.off);
  });
  useEventListener(cameraFlashModeAutoEvent, () => {
    setCameraFlashMode(CameraPicker.Constants.Type.auto);
  });

  // Reset all state when event canceled
  useEventListener(cancelEvent, resetState);

  // Reset all state and bring up picker again.
  useEventListener(retryEvent, () => {
    resetState();
    setIsPicking(true);
  });

  let currentState = 'default';
  if (isPickerError || uploadParamsError || isUploadError) {
    currentState = 'error';
  } else if (currentPicker === Picker.CAMERA) {
    currentState = 'camera';
  } else if (fileResult) {
    if (isUploaded) {
      currentState = 'uploaded';
    } else {
      currentState = 'uploading';
    }
  } else if (isPicking) {
    currentState = 'picking';
  } else if (initialUrl) {
    currentState = 'existing';
  }

  const stateEl: Element | undefined = getStateElement(element, currentState);
  const children = stateEl
    ? Hyperview.renderElement(
        stateEl,
        props.stylesheets,
        props.onUpdate,
        props.options,
      )
    : null;

  switch (currentState) {
    case 'camera':
      return (
        <Modal animationType="none">
          <View style={styles.cameraContainer}>
            <CameraPicker.View
              ref={setCamera}
              captureAudio={false}
              flashMode={cameraFlashMode}
              mirrorImage={false}
              style={styles.camera}
              type={cameraType}
            >
              <SafeAreaView style={styles.cameraContainer}>
                {children}
              </SafeAreaView>
            </CameraPicker.View>
          </View>
        </Modal>
      );
    default:
      return (
        <DocumentPicker.View ref={setDocument}>{children}</DocumentPicker.View>
      );
  }
}

S3FileUpload.namespaceURI = NAMESPACE;

S3FileUpload.localName = 'field';
