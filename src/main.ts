import {
  Application,
  Button,
  Text,
  useState,
  View,
  Window,
  StyleSheet,
} from "@Julia/core";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#444",
  },
});

function Main() {
  const [message, setMessage] = useState("Julia");

  return Window({
    title: "Test",
    width: 1024,
    height: 764,
    children: [
      View({
        // width: 1024,
        // height: 764,
        style: styles.container,
        children: [
          Text(`Halo dari ${message}`),
          Button({
            text: "click me",
            onClick: () => {
              setMessage("fhkdhfkjhfkdhksjdkfjksjhfjhkhkhkjhkjhjoioihoyoiuyf");
              console.log("ok");
            },
          }),
        ],
      }),
    ],
  });
}

Application.run(Main);
