import type { VNode, VNodeChild } from "../types";
import type { DiffOptions, DiffResult, NodePath, Patch } from "./types";
import { diffProps } from "./diffProps";
import { diffChildren } from "./diffChildren";
import { isEmptyNode, isTextNode, isVNode, vnode } from "./vnode";

export function diff(
  previous: VNodeChild,
  next: VNodeChild,
  options: DiffOptions = {},
): DiffResult {
  const patches: Patch[] = [];
  const maxDepth = options.maxDepth ?? Infinity;

  function walk(
    oldNode: VNodeChild,
    newNode: VNodeChild,
    path: NodePath,
    depth: number,
  ): Patch[] {
    if (Object.is(oldNode, newNode)) {
      return [];
    }

    if (isEmptyNode(oldNode) && isEmptyNode(newNode)) {
      return [];
    }

    if (!vnode(oldNode, newNode)) {
      return [{ type: "REPLACE_NODE", path, node: newNode }];
    }

    if (depth > maxDepth) {
      return [{ type: "REPLACE_NODE", path, node: newNode }];
    }

    if (isTextNode(oldNode) && isTextNode(newNode)) {
      return [
        {
          type: "UPDATE_TEXT",
          path,
          value: newNode,
        },
      ];
    }

    if (!isVNode(oldNode) || !isVNode(newNode)) {
      return [];
    }

    const result: Patch[] = [];

    const propChanges = diffProps(oldNode, newNode);

    if (propChanges) {
      result.push({
        type: "UPDATE_PROPS",
        path,
        changes: propChanges,
      });
    }

    result.push(
      ...diffChildren(oldNode, newNode, path, (a, b, childPath) =>
        walk(a, b, childPath, depth + 1),
      ),
    );

    return result;
  }

  patches.push(...walk(previous, next, [], 0));

  return {
    patches,
    changed: patches.length > 0,
  };
}
