import Toast from 'react-native-root-toast';

export default {
  action: "show-toast",
  callback: (behaviorElement) => {
    const message = behaviorElement.getAttribute("toast-message");
    if (message != null) {
      Toast.show(message, {
        position: Toast.positions.TOP,
        backgroundColor: 'green',
        opacity: 1,
      });
    }
  },
};
