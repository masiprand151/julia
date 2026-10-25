import { QWidget, QBoxLayout, Direction } from "@nodegui/nodegui";

import type { VNodeChild } from "../types";
import type { JuliaLayout, Props } from "./types";
import { isVNode, propsOf } from "./vnode-utils";

export function createLayout(type: string): QBoxLayout {
  const direction =
    type.toLowerCase() === "row"
      ? Direction.LeftToRight
      : Direction.TopToBottom;

  return new QBoxLayout(direction);
}

export function placeWidget(
  widget: QWidget,
  node: VNodeChild,
  index: number,
): void {
  const props: Props = isVNode(node) ? propsOf(node) : {};
  const type = isVNode(node) ? String(node.type).toLowerCase() : "text";

  const isContainer = !["text", "button"].includes(type);

  const x = Number(props.x ?? 10);
  const y = Number(props.y ?? index * 45);
  const width = Number(props.width ?? (isContainer ? 780 : 300));
  const height = Number(props.height ?? (isContainer ? 500 : 35));

  widget.setGeometry(x, y, width, height);
}

export function attachWidget(
  widget: QWidget,
  node: VNodeChild,
  parentLayout: JuliaLayout | null,
  index: number,
): void {
  if (!parentLayout) {
    placeWidget(widget, node, index);
    return;
  }

  if (parentLayout instanceof QBoxLayout) {
    parentLayout.insertWidget(index, widget);
  } else {
    parentLayout.addWidget(widget);
  }
}
