import type {
  QApplication,
  QMainWindow,
  QWidget,
  QBoxLayout,
  FlexLayout,
} from "@nodegui/nodegui";

import type { VNode, VNodeChild } from "../types";

export type Props = Record<string, unknown>;

export type JuliaLayout = FlexLayout | QBoxLayout;

export interface MountedNode {
  vnode: VNodeChild;
  widget: QWidget;
  layout: JuliaLayout | null;
  parentLayout: JuliaLayout | null;
  parentWidget: QWidget;
  children: MountedNode[];
}

export interface ApplicationState {
  window: QMainWindow | null;
  rootWidget: QWidget | null;
  mountedRoot: MountedNode | null;
  previous: VNode | null;
  component: (() => VNode) | null;
}
