import type { VNode, VNodeChild } from "../types";

export function isVNode(value: unknown): value is VNode {
  return (
    typeof value === "object" &&
    value !== null &&
    "$$typeof" in value &&
    (value as { $$typeof?: unknown }).$$typeof === Symbol.for("julia.vnode")
  );
}

export function isEmptyNode(value: VNodeChild): boolean {
  return value === null || value === undefined || typeof value === "boolean";
}

export function isTextNode(value: VNodeChild): value is string | number {
  return typeof value === "string" || typeof value === "number";
}

export function vnode(previous: VNodeChild, next: VNodeChild): boolean {
  if (isEmptyNode(previous) || isEmptyNode(next)) {
    return isEmptyNode(previous) && isEmptyNode(next);
  }

  if (isTextNode(previous) || isTextNode(next)) {
    return isTextNode(previous) && isTextNode(next);
  }

  if (!isVNode(previous) || !isVNode(next)) {
    return false;
  }

  return (
    previous.type === next.type &&
    previous.key === next.key &&
    previous.kind === next.kind
  );
}
