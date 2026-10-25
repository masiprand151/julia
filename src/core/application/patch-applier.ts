import { QLabel } from "@nodegui/nodegui";

import type { VNode } from "../types";
import { diff } from "../reconciler";
import { state } from "./state";
import { isVNode, getVNodeAtPath } from "./vnode-utils";
import { createWidget } from "./widget-factory";
import { getMounted, getMountedParent, removeMounted } from "./mounted-tree";
import { applyProps } from "./props-applier";

export function applyPatches(
  next: VNode,
  patches: ReturnType<typeof diff>["patches"],
): void {
  for (const patch of patches) {
    switch (patch.type) {
      case "UPDATE_PROPS": {
        const mounted = getMounted(patch.path);
        const newNode = getVNodeAtPath(next, patch.path);

        if (!mounted || !isVNode(newNode)) break;

        const type = String(newNode.type).toLowerCase();

        if (type === "text" && mounted.widget instanceof QLabel) {
          const label = mounted.widget;
          const props = newNode.props as Record<string, unknown>;

          label.setText(String(props.text ?? ""));
          label.setWordWrap(false);

          mounted.vnode = newNode;
          label.setMinimumWidth(label.sizeHint().width());
          label.updateGeometry();
          label.update();

          if (mounted.parentLayout) {
            mounted.parentLayout.invalidate();
            mounted.parentLayout.activate();
          }
        } else {
          mounted.vnode = newNode;
          applyProps(mounted, newNode);
        }

        break;
      }

      case "UPDATE_TEXT": {
        const mounted = getMounted(patch.path);

        if (!mounted || !(mounted.widget instanceof QLabel)) {
          break;
        }

        const label = mounted.widget;

        label.setText(String(patch.value));
        label.setWordWrap(false);

        // Hitung ukuran teks terbaru.
        label.adjustSize();
        label.updateGeometry();

        // Perbarui layout parent tanpa membuat ulang QLabel.
        if (mounted.parentLayout) {
          mounted.parentLayout.invalidate();
          mounted.parentLayout.activate();
        }

        label.update();

        break;
      }

      case "REPLACE_NODE": {
        if (patch.path.length === 0) {
          mountRoot(next);
          return;
        }

        const parent = getMounted(patch.path.slice(0, -1));
        const index = patch.path[patch.path.length - 1];

        if (!parent) break;

        removeMounted(parent, index);

        const replacement = createWidget(
          patch.node,
          parent.widget,
          parent.layout,
          index,
        );

        if (replacement) {
          parent.children.splice(index, 0, replacement);
        }

        break;
      }

      case "REMOVE_CHILD": {
        const parent = getMounted(patch.path);

        if (parent) {
          removeMounted(parent, patch.index);
        }

        break;
      }

      case "INSERT_CHILD": {
        const parent = getMounted(patch.path);
        if (!parent) break;

        const inserted = createWidget(
          patch.node,
          parent.widget,
          parent.layout,
          patch.index,
        );

        if (inserted) {
          parent.children.splice(patch.index, 0, inserted);
        }

        break;
      }

      case "MOVE_CHILD": {
        // Belum diimplementasikan pada kode asli.
        break;
      }
    }
  }
}

function mountRoot(node: VNode): void {
  if (!state.window) return;

  const props = node.props as Record<string, unknown>;

  state.window.setWindowTitle(String(props.title ?? "Julia"));
  state.window.resize(Number(props.width ?? 800), Number(props.height ?? 600));

  const { QWidget } =
    require("@nodegui/nodegui") as typeof import("@nodegui/nodegui");

  const rootWidget = new QWidget();
  state.window.setCentralWidget(rootWidget);

  const root = {
    vnode: node,
    widget: rootWidget,
    layout: null,
    parentWidget: rootWidget,
    parentLayout: null,
    children: [],
  };

  const children = node.children ?? [];

  // Normalisasi dan pemasangan children ditangani di Application.ts.
  // Fungsi ini akan diganti dengan callback mountRoot dari Application.
  void children;

  state.rootWidget = rootWidget;
  state.mountedRoot = root;
  state.previous = node;
}
