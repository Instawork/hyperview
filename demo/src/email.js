import { email } from 'react-native-communications';

const namespace = "https://manning.com/hyperview/communications";

export default {
  action: "open-email",
  callback: (behaviorElement) => {
    const address = behaviorElement.getAttributeNS(namespace, "email-address");
    if (address != null) {
      email([address], null, null, null, null);
    }
  },
};
