import type { DocumentPickerOptions, DocumentPickerResponse } from '../types';
import React, { PureComponent, createRef } from 'react';
import type { PropsWithChildren } from 'react';
import { View as RNView } from 'react-native';

const DocumentPicker = {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isCancel = (err: unknown): boolean => false;

export const types: Record<string, string> = {
  allFiles: '*/*',
  audio: 'audio/*',
  csv: 'text/csv',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  images: 'image/*',
  pdf: 'application/pdf',
  plainText: 'text/plain',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  video: 'video/*',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip',
};

type Props = PropsWithChildren & {
  ref: React.Ref<RNView>;
};

type State = {
  accept: string | undefined;
  file: File | undefined;
};

export class View extends PureComponent<Props, State> {
  ref = createRef<HTMLInputElement>();

  picker: Promise<DocumentPickerResponse> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      accept: undefined,
      file: undefined,
    };
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length) {
      this.setState({ file: files[0] as File });
    }
  };

  pickSingle = async (options: DocumentPickerOptions) => {
    if (options.type) {
      this.setState({ accept: options.type });
    }
    this.ref.current?.click();
    const waitForFile = async (): Promise<DocumentPickerResponse> => {
      if (!this.state.file) {
        return new Promise(resolve =>
          setTimeout(() => resolve(waitForFile()), 10),
        );
      }
      const { name, size, type, webkitRelativePath } = this.state.file;
      return {
        name,
        size,
        type,
        uri: webkitRelativePath,
      };
    };
    return waitForFile();
  };

  render() {
    return (
      <RNView>
        <input
          ref={this.ref}
          accept={this.state.accept}
          onChange={this.onChange}
          style={{ display: 'none' }}
          type="file"
        />
        {this.props.children}
      </RNView>
    );
  }
}

export default DocumentPicker;
