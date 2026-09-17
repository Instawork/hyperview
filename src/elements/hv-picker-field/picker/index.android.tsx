import React, { useEffect, useRef } from 'react';
import Picker from 'hyperview/src/components/picker';
import type { Props } from './types';
import styles from './styles';

/**
 * On Android, the system picker opens a dialog when the native spinner gets focused.
 * The spinner is only mounted while the field is focused, and kept out of the layout,
 * so that the field itself is rendered by Hyperview like on iOS.
 */
export default (props: Props): React.JSX.Element | null => {
  const pickerRef = useRef<Picker<string>>(null);
  const selected = useRef(false);

  useEffect(() => {
    if (props.focused) {
      pickerRef.current?.focus();
    }
  }, [props.focused]);

  if (!props.focused) {
    return null;
  }

  return (
    <Picker
      ref={pickerRef}
      onBlur={() => {
        if (!selected.current) {
          props.onCancel();
        }
      }}
      onValueChange={(value: string | null | undefined) => {
        selected.current = true;
        props.onDone(value || '');
      }}
      selectedValue={props.value}
      style={styles.anchor}
    >
      {props.children}
    </Picker>
  );
};
