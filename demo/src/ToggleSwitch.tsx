import { Switch, Text, View } from 'react-native';

/**
 * Render a toggle switch
 */
export const ToggleSwitch = (props: {
  isEnabled: boolean;
  toggleValue: () => void;
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          lineHeight: 24,
          color: '#000000',
        }}
      >
        Enable Internal Navigation
      </Text>
      <Switch
        trackColor={{ false: '#E1E1E1', true: '#4778FF' }}
        onValueChange={props.toggleValue}
        value={props.isEnabled}
      />
    </View>
  );
};
