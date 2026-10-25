import { Application, useState } from "./core/Application";
import { Button, Text, View, Window } from "./core/component";

function Main() {
  const [message, setMessage] = useState("Julia");

  return Window({
    title: "Test",
    width: 800,
    height: 600,
    children: [
      View({
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
