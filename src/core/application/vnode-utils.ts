import type { VNode, VNodeChild } from "../types";
import type { Props } from "./types";

export function propsOf(node: VNode): Props {
  return node.props as Props;
}

export function isVNode(value: unknown): value is VNode {
  return (
    typeof value === "object" &&
    value !== null &&
    "$$typeof" in value &&
    (value as { $$typeof: unknown }).$$typeof === Symbol.for("julia.vnode")
  );
}

export function normalizeChildren(
  children: readonly VNodeChild[],
): VNodeChild[] {
  const result: VNodeChild[] = [];

  const visit = (child: VNodeChild): void => {
    if (child === null || child === undefined || typeof child === "boolean") {
      return;
    }

    if (Array.isArray(child)) {
      for (const item of child) visit(item);
      return;
    }

    result.push(child);
  };

  for (const child of children) visit(child);

  return result;
}

export function getVNodeAtPath(
  root: VNode,
  path: readonly number[],
): VNodeChild | null {
  let current: VNodeChild = root;

  for (const index of path) {
    if (!isVNode(current)) return null;

    const children = normalizeChildren(current.children);
    current = children[index] ?? null;
  }

  return current;
}
