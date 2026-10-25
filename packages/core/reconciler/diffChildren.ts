import type { VNode, VNodeChild } from "../types";
import type { NodePath, Patch } from "./types";
import { isEmptyNode, vnode } from "./vnode";

export function normalizeChildren(
  children: readonly VNodeChild[],
): VNodeChild[] {
  const result: VNodeChild[] = [];

  const append = (child: VNodeChild): void => {
    if (Array.isArray(child)) {
      for (const nested of child) {
        append(nested);
      }
      return;
    }

    if (isEmptyNode(child)) return;

    result.push(child);
  };

  for (const child of children) {
    append(child);
  }

  return result;
}

export function diffChildren(
  previous: VNode,
  next: VNode,
  path: NodePath,
  diffNode: (previous: VNodeChild, next: VNodeChild, path: NodePath) => Patch[],
): Patch[] {
  const oldChildren = normalizeChildren(previous.children);
  const newChildren = normalizeChildren(next.children);

  const patches: Patch[] = [];
  const sharedLength = Math.min(oldChildren.length, newChildren.length);

  for (let index = 0; index < sharedLength; index++) {
    const oldChild = oldChildren[index];
    const newChild = newChildren[index];

    if (vnode(oldChild, newChild)) {
      patches.push(...diffNode(oldChild, newChild, [...path, index]));
    } else {
      patches.push({
        type: "REPLACE_NODE",
        path: [...path, index],
        node: newChild,
      });
    }
  }

  // Hapus dari indeks terbesar agar indeks sebelumnya tidak bergeser.
  for (
    let index = oldChildren.length - 1;
    index >= newChildren.length;
    index--
  ) {
    patches.push({
      type: "REMOVE_CHILD",
      path,
      index,
    });
  }

  // Tambahkan child baru pada posisi akhirnya.
  for (let index = oldChildren.length; index < newChildren.length; index++) {
    patches.push({
      type: "INSERT_CHILD",
      path,
      index,
      node: newChildren[index],
    });
  }

  return patches;
}
