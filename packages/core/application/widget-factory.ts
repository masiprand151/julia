import {
  QWidget,
  QLabel,
  QPushButton,
  FlexLayout,
  QSizePolicyPolicy,
} from "@nodegui/nodegui";

import type { VNodeChild } from "../types";
import type { MountedNode, JuliaLayout } from "./types";
import { state } from "./state";
import { isVNode, propsOf, normalizeChildren } from "./vnode-utils";
import { createLayout, attachWidget } from "./layout";
import { attachEvents } from "./events";
import { compileStyleSheet } from "../style";

export function createWidget(
  node: VNodeChild,
  parentWidget: QWidget,
  parentLayout: JuliaLayout | null,
  index: number,
): MountedNode | null {
  if (node === null || node === undefined || typeof node === "boolean") {
    return null;
  }

  if (typeof node === "string" || typeof node === "number") {
    const label = new QLabel(parentWidget);
    label.setText(String(node));

    attachWidget(label, node, parentLayout, index);

    return {
      vnode: node,
      widget: label,
      layout: null,
      parentWidget,
      parentLayout,
      children: [],
    };
  }

  if (!isVNode(node)) return null;

  const type = String(node.type).toLowerCase();
  const props = propsOf(node);

  let widget: QWidget;
  let layout: JuliaLayout | null = null;

  if (type === "text") {
    const label = new QLabel(parentWidget);

    label.setText(String(props.text ?? ""));
    label.setWordWrap(false);
    label.setMinimumWidth(0);

    label.setSizePolicy(QSizePolicyPolicy.Minimum, QSizePolicyPolicy.Fixed);

    widget = label;
  } else if (type === "button") {
    const button = new QPushButton(parentWidget);
    button.setText(String(props.text ?? ""));
    widget = button;
  } else {
    const container = new QWidget(parentWidget);

    widget = container;

    if (type === "view") {
      layout = new FlexLayout();
    } else {
      layout = createLayout(type);
    }

    container.setLayout(layout);
  }

  if (props.width != null || props.height != null) {
    const width = Number(props.width ?? widget.width());
    const height = Number(props.height ?? widget.height());

    widget.setFixedSize(width, height);
  }

  applyWidgetStyle(widget, props, type);
  attachWidget(widget, node, parentLayout, index);
  attachEvents(widget, node);

  const mounted: MountedNode = {
    vnode: node,
    widget,
    layout,
    parentWidget,
    parentLayout,
    children: [],
  };

  if (layout) {
    const children = normalizeChildren(node.children);

    children.forEach((child, childIndex) => {
      const childMounted = createWidget(child, widget, layout, childIndex);

      if (childMounted) mounted.children.push(childMounted);
    });
  }

  return mounted;
}

function applyWidgetStyle(widget: QWidget, props: any, type: string): void {
  if (!props.style) return;

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
    type === "button" ? "QPushButton" : type === "text" ? "QLabel" : "QWidget";

  widget.setStyleSheet(compileStyleSheet(props.style, selector, target));
}
