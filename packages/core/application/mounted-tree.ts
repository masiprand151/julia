import type { VNode, VNodeChild } from "../types";
import type { MountedNode } from "./types";
import { state } from "./state";
import { placeWidget } from "./layout";
import { normalizeChildren, isVNode } from "./vnode-utils";

export function getMounted(path: readonly number[]): MountedNode | null {
  let current = state.mountedRoot;

  for (const index of path) {
    if (!current) return null;
    current = current.children[index] ?? null;
  }

  return current;
}

export function getMountedParent(target: MountedNode): MountedNode | null {
  const search = (node: MountedNode): MountedNode | null => {
    for (const child of node.children) {
      if (child === target) return node;

      const result = search(child);
      if (result) return result;
    }

    return null;
  };

  return state.mountedRoot ? search(state.mountedRoot) : null;
}

export function getMountedIndex(mounted: MountedNode): number {
  const parent = getMountedParent(mounted);

  return parent ? parent.children.indexOf(mounted) : 0;
}

export function removeMounted(parent: MountedNode, index: number): void {
  const child = parent.children[index];
  if (!child) return;

  if (parent.layout) {
    parent.layout.removeWidget(child.widget);
  }

  child.widget.close();
  parent.children.splice(index, 1);

  if (!parent.layout) {
    parent.children.forEach((item, childIndex) => {
      placeWidget(item.widget, item.vnode, childIndex);
    });
  }
}
