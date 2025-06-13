import React, { useEffect, useRef } from 'react';
import {
  createDateFromString,
  createStringFromDate,
} from 'hyperview/src/elements/hv-date-field/helpers';
import type { Props } from './types';

export default (props: Props): JSX.Element => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (props.focused) {
      inputRef?.current?.focus();
      inputRef?.current?.showPicker();
    }
  }, [props.focused]);

  return (
    <input
      ref={inputRef}
      max={createStringFromDate(props.maxDate)}
      min={createStringFromDate(props.minDate)}
      onBlur={() => {
        props.onCancel();
      }}
      onChange={evt => {
        props.onDone(createDateFromString(evt.target.value) || undefined);
      }}
      style={{ height: 0, opacity: 0, width: 0 }}
      type="date"
    />
  );
};
