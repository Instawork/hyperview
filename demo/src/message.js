import Toast from 'react-native-root-toast';

const namespace = "https://hypermedia.systems/hyperview/message";

export default {
  action: "show-message",
  callback: (behaviorElement) => {
    const text = behaviorElement.getAttributeNS(namespace, "text");
    if (text != null) {
      Toast.show(text, {
        position: Toast.positions.TOP,
        opacity: 1,
      });
    }
  }
};
