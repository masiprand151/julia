import {
  Application,
  Window,
  Column,
  Row,
  Expanded,
  Spacer,
  ScrollView,
  Text,
  Button,
} from "@Julia/core";

function Main() {
  return Window({
    title: "Julia Layout Demo",
    width: 1024,
    height: 768,
    body: [
      Column({
        style: {
          flex: 1,
          flexDirection: "column",
          backgroundColor: "#f3f4f6",
          padding: 16,
        },
        children: [
          Text("Dashboard"),
          Row({
            children: [
              Text("Selamat datang", { fontSize: 25 }),
              Spacer(),
              Button({ text: "Pengaturan" }),
            ],
          }),
          Expanded({
            children: [
              ScrollView({
                children: Array.from({ length: 100 }, (_, index) =>
                  Text(`Baris ${index + 1}`),
                ),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

Application.run(Main);
