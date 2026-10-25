import { QLabel, QPushButton } from "@nodegui/nodegui";

import type { VNode } from "../types";
import type { MountedNode } from "./types";
import { state } from "./state";
import { propsOf } from "./vnode-utils";
import { placeWidget } from "./layout";
import { getMountedIndex } from "./mounted-tree";
import { compileStyleSheet, StyleInput } from "../style";

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

  if (props.style) {
    const widget = mounted.widget;
    const type = String(node.type).toLowerCase();

    const selector =
      type === "button"
        ? "QPushButton#juliaButton"
        : type === "text"
          ? "QLabel#juliaText"
          : "QWidget#juliaView";

    const objectName =
      type === "button"
        ? "juliaButton"
        : type === "text"
          ? "juliaText"
          : "juliaView";

    widget.setObjectName(objectName);
    const target =
      type === "button"
        ? "QPushButton"
        : type === "text"
          ? "QLabel"
          : "QWidget";

    widget.setStyleSheet(
      compileStyleSheet(props.style as StyleInput, selector, target),
    );
  }

  if (!mounted.parentLayout) {
    placeWidget(mounted.widget, node, getMountedIndex(mounted));
  }
}
