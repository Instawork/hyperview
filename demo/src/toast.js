import Toast from 'react-native-root-toast';

const namespace = "https://manning.com/hyperview/toast";

export default {
  action: "show-toast",
  callback: (behaviorElement) => {
    const message = behaviorElement.getAttributeNS(namespace, "message");
    if (message != null) {
      Toast.show(message, {
        position: Toast.positions.TOP,
        opacity: 1,
      });
    }
  },
};
