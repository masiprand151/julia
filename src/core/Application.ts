// import {
//   QApplication,
//   QMainWindow,
//   QWidget,
//   QLabel,
//   QPushButton,
//   QBoxLayout,
//   Direction,
//   FlexLayout,
// } from "@nodegui/nodegui";
// import type { VNode, VNodeChild } from "./types";
// import { diff } from "./reconciler";

// type Props = Record<string, unknown>;
// type JuliaLayout = FlexLayout | QBoxLayout;

// interface MountedNode {
//   vnode: VNodeChild;
//   widget: QWidget;
//   layout: JuliaLayout | null;
//   parentLayout: JuliaLayout | null;
//   parentWidget: QWidget;
//   children: MountedNode[];
// }

// export class Application {
//   private static window: QMainWindow | null = null;
//   private static rootWidget: QWidget | null = null;
//   private static mountedRoot: MountedNode | null = null;
//   private static previous: VNode | null = null;
//   private static component: (() => VNode) | null = null;

//   private static propsOf(node: VNode): Props {
//     return node.props as Props;
//   }

//   private static isVNode(value: unknown): value is VNode {
//     return (
//       typeof value === "object" &&
//       value !== null &&
//       "$$typeof" in value &&
//       (value as { $$typeof: unknown }).$$typeof === Symbol.for("julia.vnode")
//     );
//   }

//   private static normalizeChildren(
//     children: readonly VNodeChild[],
//   ): VNodeChild[] {
//     const result: VNodeChild[] = [];

//     const visit = (child: VNodeChild): void => {
//       if (child === null || child === undefined || typeof child === "boolean") {
//         return;
//       }

//       if (Array.isArray(child)) {
//         for (const item of child) visit(item);
//         return;
//       }

//       result.push(child);
//     };

//     for (const child of children) visit(child);
//     return result;
//   }

//   private static createLayout(type: string): QBoxLayout {
//     const direction =
//       type.toLowerCase() === "row"
//         ? Direction.LeftToRight
//         : Direction.TopToBottom;

//     return new QBoxLayout(direction);
//   }

//   private static placeWidget(
//     widget: QWidget,
//     node: VNodeChild,
//     index: number,
//   ): void {
//     const props = this.isVNode(node) ? this.propsOf(node) : {};
//     const type = this.isVNode(node) ? String(node.type).toLowerCase() : "text";
//     const isContainer = !["text", "button"].includes(type);

//     const x = Number(props.x ?? 10);
//     const y = Number(props.y ?? index * 45);
//     const width = Number(props.width ?? (isContainer ? 780 : 300));
//     const height = Number(props.height ?? (isContainer ? 500 : 35));

//     widget.setGeometry(x, y, width, height);
//   }

//   private static attachWidget(
//     widget: QWidget,
//     node: VNodeChild,
//     parentLayout: JuliaLayout | null,
//     index: number,
//   ): void {
//     if (!parentLayout) {
//       this.placeWidget(widget, node, index);
//       return;
//     }

//     // QBoxLayout supports insertion at a specific index.
//     // FlexLayout uses addWidget(), so it appends the widget.
//     if (parentLayout instanceof QBoxLayout) {
//       parentLayout.insertWidget(index, widget);
//     } else {
//       parentLayout.addWidget(widget);
//     }
//   }

//   private static createWidget(
//     node: VNodeChild,
//     parentWidget: QWidget,
//     parentLayout: JuliaLayout | null,
//     index: number,
//   ): MountedNode | null {
//     if (node === null || node === undefined || typeof node === "boolean") {
//       return null;
//     }

//     if (typeof node === "string" || typeof node === "number") {
//       const label = new QLabel(parentWidget);
//       label.setText(String(node));
//       this.attachWidget(label, node, parentLayout, index);

//       return {
//         vnode: node,
//         widget: label,
//         layout: null,
//         parentWidget,
//         parentLayout,
//         children: [],
//       };
//     }

//     if (!this.isVNode(node)) return null;

//     const type = String(node.type).toLowerCase();
//     const props = this.propsOf(node);

//     let widget: QWidget;
//     let layout: JuliaLayout | null = null;

//     if (type === "text") {
//       const label = new QLabel(parentWidget);
//       label.setText(String(props.text ?? ""));
//       widget = label;
//     } else if (type === "button") {
//       // button widget
//       const button = new QPushButton(parentWidget);
//       button.setText(String(props.text ?? ""));
//       widget = button;
//     } else {
//       // View uses FlexLayout; Row and Column use QBoxLayout.
//       const container = new QWidget(parentWidget);
//       widget = container;

//       if (type === "view") {
//         layout = new FlexLayout();
//         //
//       } else {
//         layout = this.createLayout(type);
//       }

//       container.setLayout(layout);
//     }

//     this.attachWidget(widget, node, parentLayout, index);

//     const mounted: MountedNode = {
//       vnode: node,
//       widget,
//       layout,
//       parentWidget,
//       parentLayout,
//       children: [],
//     };

//     if (layout) {
//       const children = this.normalizeChildren(node.children);

//       children.forEach((child, childIndex) => {
//         const childMounted = this.createWidget(
//           child,
//           widget,
//           layout,
//           childIndex,
//         );

//         if (childMounted) mounted.children.push(childMounted);
//       });
//     }

//     return mounted;
//   }

//   private static applyProps(mounted: MountedNode, node: VNode): void {
//     const props = this.propsOf(node);
//     const type = String(node.type).toLowerCase();

//     if (type === "window") {
//       if (this.window) {
//         this.window.setWindowTitle(String(props.title ?? "Julia"));
//         this.window.resize(
//           Number(props.width ?? 800),
//           Number(props.height ?? 600),
//         );
//       }
//       return;
//     }

//     if (type === "text" && mounted.widget instanceof QLabel) {
//       mounted.widget.setText(String(props.text ?? ""));
//     } else if (type === "button" && mounted.widget instanceof QPushButton) {
//       mounted.widget.setText(String(props.text ?? ""));
//     }

//     if (!mounted.parentLayout) {
//       this.placeWidget(mounted.widget, node, this.getMountedIndex(mounted));
//     }
//   }

//   private static getMountedIndex(mounted: MountedNode): number {
//     const parent = this.getMountedParent(mounted);
//     return parent ? parent.children.indexOf(mounted) : 0;
//   }

//   private static getMountedParent(target: MountedNode): MountedNode | null {
//     const search = (node: MountedNode): MountedNode | null => {
//       for (const child of node.children) {
//         if (child === target) return node;
//         const result = search(child);
//         if (result) return result;
//       }
//       return null;
//     };

//     return this.mountedRoot ? search(this.mountedRoot) : null;
//   }

//   private static mountRoot(node: VNode): void {
//     if (!this.window) return;

//     const props = this.propsOf(node);
//     this.window.setWindowTitle(String(props.title ?? "Julia"));
//     this.window.resize(Number(props.width ?? 800), Number(props.height ?? 600));

//     // The root widget intentionally has no layout.
//     const rootWidget = new QWidget();
//     this.window.setCentralWidget(rootWidget);

//     const root: MountedNode = {
//       vnode: node,
//       widget: rootWidget,
//       layout: null,
//       parentWidget: rootWidget,
//       parentLayout: null,
//       children: [],
//     };

//     const children = this.normalizeChildren(node.children);
//     children.forEach((child, index) => {
//       const childMounted = this.createWidget(child, rootWidget, null, index);
//       if (childMounted) root.children.push(childMounted);
//     });

//     this.rootWidget = rootWidget;
//     this.mountedRoot = root;
//     this.previous = node;
//   }

//   private static getMounted(path: readonly number[]): MountedNode | null {
//     let current = this.mountedRoot;

//     for (const index of path) {
//       if (!current) return null;
//       current = current.children[index] ?? null;
//     }

//     return current;
//   }

//   private static getVNodeAtPath(
//     root: VNode,
//     path: readonly number[],
//   ): VNodeChild | null {
//     let current: VNodeChild = root;

//     for (const index of path) {
//       if (!this.isVNode(current)) return null;
//       const children = this.normalizeChildren(current.children);
//       current = children[index] ?? null;
//     }

//     return current;
//   }

//   private static removeMounted(parent: MountedNode, index: number): void {
//     const child = parent.children[index];
//     if (!child) return;

//     if (parent.layout) parent.layout.removeWidget(child.widget);
//     child.widget.close();
//     parent.children.splice(index, 1);

//     if (!parent.layout) {
//       parent.children.forEach((item, childIndex) => {
//         this.placeWidget(item.widget, item.vnode, childIndex);
//       });
//     }
//   }

//   private static applyPatches(
//     next: VNode,
//     patches: ReturnType<typeof diff>["patches"],
//   ): void {
//     for (const patch of patches) {
//       switch (patch.type) {
//         case "UPDATE_PROPS": {
//           const mounted = this.getMounted(patch.path);
//           const newNode = this.getVNodeAtPath(next, patch.path);
//           if (mounted && this.isVNode(newNode)) {
//             mounted.vnode = newNode;
//             this.applyProps(mounted, newNode);
//           }
//           break;
//         }

//         case "UPDATE_TEXT": {
//           const mounted = this.getMounted(patch.path);
//           if (mounted && mounted.widget instanceof QLabel) {
//             mounted.widget.setText(String(patch.value));
//             mounted.vnode = patch.value;
//           }
//           break;
//         }

//         case "REPLACE_NODE": {
//           if (patch.path.length === 0) {
//             this.mountRoot(next);
//             return;
//           }

//           const parent = this.getMounted(patch.path.slice(0, -1));
//           const index = patch.path[patch.path.length - 1];
//           if (!parent) break;

//           this.removeMounted(parent, index);
//           const replacement = this.createWidget(
//             patch.node,
//             parent.widget,
//             parent.layout,
//             index,
//           );
//           if (replacement) parent.children.splice(index, 0, replacement);
//           break;
//         }

//         case "REMOVE_CHILD": {
//           const parent = this.getMounted(patch.path);
//           if (parent) this.removeMounted(parent, patch.index);
//           break;
//         }

//         case "INSERT_CHILD": {
//           const parent = this.getMounted(patch.path);
//           if (!parent) break;

//           const inserted = this.createWidget(
//             patch.node,
//             parent.widget,
//             parent.layout,
//             patch.index,
//           );
//           if (inserted) parent.children.splice(patch.index, 0, inserted);
//           break;
//         }

//         case "MOVE_CHILD": {
//           // Not implemented yet; requires move-aware diffing and layout handling.
//           break;
//         }
//       }
//     }
//   }

//   static updateUI(node?: VNode): void {
//     const next = node ?? this.component?.();
//     if (!next) return;

//     if (!this.previous || !this.mountedRoot) {
//       this.mountRoot(next);
//       return;
//     }

//     const result = diff(this.previous, next);
//     if (!result.changed) return;

//     this.applyPatches(next, result.patches);
//     this.previous = next;
//   }

//   static run(component: () => VNode): void {
//     this.component = component;
//     const initWindow = component();

//     if (String(initWindow.type).toLowerCase() !== "window") {
//       throw new Error("Komponen root harus berupa Window.");
//     }

//     QApplication.instance();
//     this.window = new QMainWindow();
//     this.mountRoot(initWindow);
//     this.window.show();
//     QApplication.instance().exec();
//   }
// }

import { QApplication, QMainWindow, QWidget } from "@nodegui/nodegui";

import type { VNode } from "./types";
import { diff } from "./reconciler";

import { state } from "./application/state";
import { propsOf, normalizeChildren } from "./application/vnode-utils";
import { createWidget } from "./application/widget-factory";
import { applyPatches } from "./application/patch-applier";
import type { MountedNode } from "./application/types";

export class Application {
  private static mountRoot(node: VNode): void {
    if (!state.window) return;

    const props = propsOf(node);

    state.window.setWindowTitle(String(props.title ?? "Julia"));
    state.window.resize(
      Number(props.width ?? 800),
      Number(props.height ?? 600),
    );

    const rootWidget = new QWidget();
    state.window.setCentralWidget(rootWidget);

    const root: MountedNode = {
      vnode: node,
      widget: rootWidget,
      layout: null,
      parentWidget: rootWidget,
      parentLayout: null,
      children: [],
    };

    const children = normalizeChildren(node.children);

    children.forEach((child, index) => {
      const childMounted = createWidget(child, rootWidget, null, index);

      if (childMounted) root.children.push(childMounted);
    });

    state.rootWidget = rootWidget;
    state.mountedRoot = root;
    state.previous = node;
  }

  static updateUI(node?: VNode): void {
    const next = node ?? state.component?.();
    if (!next) return;

    if (!state.previous || !state.mountedRoot) {
      this.mountRoot(next);
      return;
    }

    const result = diff(state.previous, next);
    if (!result.changed) return;

    applyPatches(next, result.patches);
    state.previous = next;
  }

  static run(component: () => VNode): void {
    state.component = component;

    const initWindow = component();

    if (String(initWindow.type).toLowerCase() !== "window") {
      throw new Error("Komponen root harus berupa Window.");
    }

    QApplication.instance();
    state.window = new QMainWindow();

    this.mountRoot(initWindow);

    state.window.show();
    QApplication.instance().exec();
  }
}
