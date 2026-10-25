import { QPushButton } from "@nodegui/nodegui";
import type { VNode } from "../types";

type EventProps = Record<string, unknown>;

export function attachEvents(widget: unknown, node: VNode): void {
  const props = node.props as EventProps;

  if (widget instanceof QPushButton && typeof props.onClick === "function") {
    widget.addEventListener("clicked", () => {
      (props.onClick as () => void)();
    });
  }
}
