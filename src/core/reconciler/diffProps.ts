import type { VNode } from "../types";
import type { PropChanges } from "./types";

const RESERVED_PROPS = new Set(["children", "key", "ref"]);

export function diffProps(previous: VNode, next: VNode): PropChanges | null {
  const oldProps = previous.props as Record<string, unknown>;
  const newProps = next.props as Record<string, unknown>;

  const set: Record<string, unknown> = {};
  const remove: string[] = [];

  for (const key of Object.keys(newProps)) {
    if (RESERVED_PROPS.has(key)) continue;

    if (!Object.is(oldProps[key], newProps[key])) {
      set[key] = newProps[key];
    }
  }

  for (const key of Object.keys(oldProps)) {
    if (RESERVED_PROPS.has(key)) continue;

    if (!(key in newProps)) {
      remove.push(key);
    }
  }

  if (Object.keys(set).length === 0 && remove.length === 0) {
    return null;
  }

  return { set, remove };
}
