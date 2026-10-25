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

    const render = (): VNode => {
      beginRender();
      return component();
    };

    setRenderCallback(() => {
      this.updateUI(render());
    });

    const initWindow = render();

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

type StateSetter<T> = (value: T | ((previous: T) => T)) => void;

const states: unknown[] = [];
let cursor = 0;
let renderCallback: (() => void) | null = null;

export function beginRender(): void {
  cursor = 0;
}

export function setRenderCallback(callback: () => void): void {
  renderCallback = callback;
}

export function useState<T>(initialValue: T): [T, StateSetter<T>] {
  const index = cursor++;

  if (!(index in states)) {
    states[index] = initialValue;
  }

  const setState: StateSetter<T> = (value) => {
    const previous = states[index] as T;
    const next =
      typeof value === "function"
        ? (value as (previous: T) => T)(previous)
        : value;

    if (Object.is(previous, next)) return;

    states[index] = next;
    renderCallback?.();
  };

  return [states[index] as T, setState];
}
