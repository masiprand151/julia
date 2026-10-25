import { QWidget, QBoxLayout, Direction, FlexLayout } from "@nodegui/nodegui";

import type { VNodeChild } from "../types";
import type { JuliaLayout, Props } from "./types";
import { isVNode, propsOf } from "./vnode-utils";

export function createLayout(type: string): JuliaLayout {
  const normalized = type.toLowerCase();

  if (normalized === "view") {
    return new FlexLayout();
  }

  const direction =
    normalized === "row" ? Direction.LeftToRight : Direction.TopToBottom;

  return new QBoxLayout(direction);
}

export function placeWidget(
  widget: QWidget,
  node: VNodeChild,
  index: number,
): void {
  const props: Props = isVNode(node) ? propsOf(node) : {};
  const type = isVNode(node) ? String(node.type).toLowerCase() : "text";

  const isContainer = !["text", "button", "spacer", "expanded"].includes(type);

  const x = Number(props.x ?? 0);
  const y = Number(props.y ?? index * 45);

  const width =
    typeof props.width === "number" ? props.width : isContainer ? 780 : 300;

  const height =
    typeof props.height === "number" ? props.height : isContainer ? 500 : 35;

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

  // if (parentLayout instanceof QBoxLayout) {
  //   parentLayout.insertWidget(index, widget);
  //   return;
  // }
  if (parentLayout instanceof QBoxLayout) {
    parentLayout.insertWidget(index, widget);

    const type = isVNode(node) ? String(node.type).toLowerCase() : "text";

    if (type === "expanded") {
      parentLayout.setStretch(index, 1);
    }

    return;
  }

  parentLayout.addWidget(widget);
}
