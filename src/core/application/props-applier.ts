import { QLabel, QPushButton } from "@nodegui/nodegui";

import type { VNode } from "../types";
import type { MountedNode } from "./types";
import { state } from "./state";
import { propsOf } from "./vnode-utils";
import { placeWidget } from "./layout";
import { getMountedIndex } from "./mounted-tree";

export function applyProps(mounted: MountedNode, node: VNode): void {
  const props = propsOf(node);
  const type = String(node.type).toLowerCase();

  if (type === "window") {
    if (state.window) {
      state.window.setWindowTitle(String(props.title ?? "Julia"));

      state.window.resize(
        Number(props.width ?? 800),
        Number(props.height ?? 600),
      );
    }

    return;
  }

  if (type === "text" && mounted.widget instanceof QLabel) {
    mounted.widget.setText(String(props.text ?? ""));
  } else if (type === "button" && mounted.widget instanceof QPushButton) {
    mounted.widget.setText(String(props.text ?? ""));
  }

  if (!mounted.parentLayout) {
    placeWidget(mounted.widget, node, getMountedIndex(mounted));
  }
}
