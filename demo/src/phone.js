import { phonecall } from 'react-native-communications';

const namespace = "https://hypermedia.systems/hyperview/communications";

export default {
  action: "open-phone",
  callback: (behaviorElement) => {
    const number = behaviorElement.getAttributeNS(namespace, "phone-number");
    if (number != null) {
      phonecall(number, false);
    }
  },
};
