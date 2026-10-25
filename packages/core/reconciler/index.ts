export * from "./types";
export * from "./vnode";
export * from "./diffProps";
export * from "./diffChildren";
export * from "./diff";

// example

// import { View, Text, Button } from "./core/vnode/component";
// import { diff } from "./core/vnode/reconciler";

// const previous = View({
//   children: [Text({ text: "Halo" }), Button({ text: "Simpan" })],
// });

// const next = View({
//   children: [Text({ text: "Halo Julia" }), Button({ text: "Update" })],
// });

// const result = diff(previous, next);

// console.log(result.changed); true | false
// console.log(result.patches); hasil
