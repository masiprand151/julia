import {
  QWidget,
  QLabel,
  QPushButton,
  FlexLayout,
  QSizePolicyPolicy,
  QBoxLayout,
  Direction,
  QScrollArea,
  ScrollBarPolicy,
} from "@nodegui/nodegui";

import type { VNodeChild } from "../types";
import type { MountedNode, JuliaLayout } from "./types";

import { isVNode, propsOf, normalizeChildren } from "./vnode-utils";
import { attachWidget } from "./layout";
import { attachEvents } from "./events";
import { compileStyleSheet, StyleSheet } from "../style";
import type { StyleInput } from "../style";

export function createWidget(
  node: VNodeChild,
  parentWidget: QWidget,
  parentLayout: JuliaLayout | null,
  index: number,
): MountedNode | null {
  if (node === null || node === undefined || typeof node === "boolean") {
    return null;
  }

  // Text node
  if (typeof node === "string" || typeof node === "number") {
    const label = new QLabel(parentWidget);
    label.setText(String(node));
    label.setMinimumSize(0, 0);
    label.setSizePolicy(QSizePolicyPolicy.Preferred, QSizePolicyPolicy.Fixed);

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

  if (!isVNode(node)) {
    return null;
  }

  const type = String(node.type).toLowerCase();
  const props = propsOf(node);

  let widget: QWidget;
  let layout: JuliaLayout | null = null;
  let childrenParentWidget: QWidget | null = null;

  // Text
  if (type === "text") {
    const label = new QLabel(parentWidget);
    label.setText(String(props.text ?? props.value ?? ""));
    label.setWordWrap(true);
    label.setMinimumSize(0, 0);
    label.setSizePolicy(
      QSizePolicyPolicy.Preferred,
      QSizePolicyPolicy.Preferred,
    );

    widget = label;
  }

  // Button
  else if (type === "button") {
    const button = new QPushButton(parentWidget);
    button.setText(String(props.text ?? props.title ?? ""));

    if (props.disabled === true) {
      button.setEnabled(false);
    }

    widget = button;
  }

  // Spacer: temporary minimal implementation
  else if (type === "spacer") {
    widget = new QWidget(parentWidget);
    widget.setMinimumSize(0, 0);
    widget.setSizePolicy(
      QSizePolicyPolicy.Expanding,
      QSizePolicyPolicy.Expanding,
    );
  }
  // scroll bug
  else if (type === "scrollview") {
    const result = createScrollView(parentWidget);

    widget = result.widget;
    layout = result.layout;
    childrenParentWidget = result.content;
  }

  // Expanded: temporary container implementation
  else {
    const container = new QWidget(parentWidget);
    widget = container;

    if (type === "row") {
      layout = new QBoxLayout(Direction.LeftToRight);
    } else if (type === "view" || type === "container") {
      layout = new FlexLayout();
    } else {
      layout = new QBoxLayout(Direction.TopToBottom);
    }

    layout.setContentsMargins(0, 0, 0, 0);

    const flattenedStyle = StyleSheet.flatten(props.style as StyleInput);

    const gap = Number(props.gap ?? flattenedStyle.gap ?? 0);

    if (layout instanceof QBoxLayout && Number.isFinite(gap) && gap > 0) {
      layout.setSpacing(gap);
    }

    container.setLayout(layout);
    container.setMinimumSize(0, 0);
    container.setSizePolicy(
      QSizePolicyPolicy.Expanding,
      QSizePolicyPolicy.Expanding,
    );

    if (type === "column" || type === "row") {
      container.setInlineStyle("flex: 1;");
    }
  }

  // Explicit numeric sizes only
  if (typeof props.width === "number") {
    widget.setFixedWidth(props.width);
  }

  if (typeof props.height === "number") {
    widget.setFixedHeight(props.height);
  }

  // Style
  applyWidgetStyle(widget, props, type);

  // Attach to parent
  attachWidget(widget, node, parentLayout, index);
  // Events
  attachEvents(widget, node);

  const mounted: MountedNode = {
    vnode: node,
    widget,
    layout,
    parentWidget,
    parentLayout,
    children: [],
  };

  // Mount children
  if (layout) {
    const children = normalizeChildren(node.children);

    children.forEach((child, childIndex) => {
      // const childMounted = createWidget(child, widget, layout, childIndex);
      const childMounted = createWidget(
        child,
        childrenParentWidget ?? widget,
        layout,
        childIndex,
      );

      if (childMounted) {
        mounted.children.push(childMounted);
      }
    });
  }

  widget.setVisible(props.visible !== false);

  return mounted;
}

function applyWidgetStyle(
  widget: QWidget,
  props: Record<string, any>,
  type: string,
): void {
  if (!props.style) {
    return;
  }

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

  const target =
    type === "button" ? "QPushButton" : type === "text" ? "QLabel" : "QWidget";

  widget.setObjectName(objectName);
  widget.setStyleSheet(
    compileStyleSheet(props.style as StyleInput, selector, target),
  );
}

function createScrollView(parentWidget: QWidget): {
  widget: QScrollArea;
  content: QWidget;
  layout: QBoxLayout;
} {
  const scrollArea = new QScrollArea(parentWidget);

  scrollArea.setFrameShape(0);
  scrollArea.setMinimumSize(0, 0);
  scrollArea.setWidgetResizable(true);
  scrollArea.setVerticalScrollBarPolicy(ScrollBarPolicy.ScrollBarAsNeeded);
  scrollArea.setHorizontalScrollBarPolicy(ScrollBarPolicy.ScrollBarAsNeeded);

  const content = new QWidget();
  content.setMinimumSize(0, 0);

  const contentLayout = new QBoxLayout(Direction.TopToBottom);

  contentLayout.setContentsMargins(0, 0, 0, 0);
  contentLayout.setSpacing(0);

  content.setLayout(contentLayout);
  scrollArea.setWidget(content);

  return {
    widget: scrollArea,
    content,
    layout: contentLayout,
  };
}
