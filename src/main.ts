import { Application } from "./core/Application";
import { Button, Text, View, Window } from "./core/component";

function Main() {
  return Window({
    title: "Test",
    width: 800,
    height: 600,
    children: [
      View({
        children: [
          Text({ text: "Halo dari Julia" }),
          Button({
            text: "click me",
            onClick: () => {
              console.log("ok");
            },
          }),
        ],
      }),
    ],
  });
}

Application.run(Main);
