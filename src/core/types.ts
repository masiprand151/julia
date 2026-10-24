import type { Style } from "./style";

/* =========================================================
 * VNODE CORE
 * ======================================================= */

export type Key = string | number;

export type Ref<T = unknown> = {
  current: T | null;
} | null;

export type VNodeKind = "element" | "fragment" | "text";

export type VNodeChild =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly VNodeChild[];

export type VNodeChildren = VNodeChild | readonly VNodeChild[];

export type VNodeType =
  | string
  | symbol
  | FunctionComponentType
  | ClassComponentType;

export interface VNode<P = Record<string, unknown>> {
  readonly $$typeof: symbol;
  readonly type: VNodeType;
  readonly kind: VNodeKind;
  readonly key: Key | null;
  readonly ref: Ref<unknown>;
  readonly props: Readonly<P & { children?: VNodeChildren }>;
  readonly children: readonly VNodeChild[];
}

export type FunctionComponentType = (
  props: Record<string, unknown>,
) => VNode | VNodeChild;

export type ClassComponentType = new (
  props: Record<string, unknown>,
) => unknown;

/* =========================================================
 * BASE PROPS
 * ======================================================= */

export interface VNodeProps {
  key?: Key | null;
  ref?: Ref<unknown>;
  children?: VNodeChildren;
  id?: string;
  className?: string;
  style?: Style;
  visible?: boolean;
  enabled?: boolean;
  testId?: string;
}

export interface ClickableProps extends VNodeProps {
  onClick?: () => void;
  onDoubleClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export interface LayoutProps extends ClickableProps {
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  padding?: number | string;
  margin?: number | string;
  gap?: number;
  flex?: number;
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around";
}

/* =========================================================
 * LAYOUT COMPONENTS
 * ======================================================= */

export interface ViewProps extends LayoutProps {}

export interface ColumnProps extends LayoutProps {}

export interface RowProps extends LayoutProps {}

export interface ScrollViewProps extends LayoutProps {
  horizontal?: boolean;
  scrollEnabled?: boolean;
}

export interface SpacerProps extends VNodeProps {
  size?: number;
}

export interface DividerProps extends VNodeProps {
  orientation?: "horizontal" | "vertical";
  thickness?: number;
  color?: string;
}

/* =========================================================
 * TEXT COMPONENTS
 * ======================================================= */

export interface TextProps extends ClickableProps {
  text?: string | number;
  value?: string | number;
  color?: string;
  fontSize?: number;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  textAlign?: "left" | "center" | "right";
  selectable?: boolean;
  maxLines?: number;
}

export interface HeadingProps extends TextProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface LabelProps extends TextProps {
  htmlFor?: string;
  required?: boolean;
}

export interface ParagraphProps extends TextProps {}

export interface LinkProps extends TextProps {
  href: string;
  target?: "_blank" | "_self";
}

/* =========================================================
 * BUTTON COMPONENTS
 * ======================================================= */

export interface ButtonProps extends ClickableProps {
  text?: string;
  title?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: string;
  type?: "button" | "submit" | "reset";
}

export interface IconButtonProps extends ButtonProps {
  icon: string;
  ariaLabel: string;
}

export interface ButtonGroupProps extends LayoutProps {
  orientation?: "horizontal" | "vertical";
}

/* =========================================================
 * INPUT COMPONENTS
 * ======================================================= */

export interface InputProps extends ClickableProps {
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "search" | "tel" | "url";
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
  onSubmit?: () => void;
}

export interface TextAreaProps extends Omit<
  InputProps,
  "type" | "onChange" | "onInput"
> {
  rows?: number;
  cols?: number;
  resize?: "none" | "horizontal" | "vertical" | "both";
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
}

export interface CheckboxProps extends ClickableProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export interface RadioProps extends CheckboxProps {
  name?: string;
  value?: string;
}

export interface SwitchProps extends CheckboxProps {}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends ClickableProps {
  name?: string;
  value?: string | number;
  options: readonly SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  onChange?: (value: string | number | (string | number)[]) => void;
}

export interface SliderProps extends ClickableProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

export interface DatePickerProps extends ClickableProps {
  value?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
}

/* =========================================================
 * FORM COMPONENTS
 * ======================================================= */

export interface FormProps extends VNodeProps {
  onSubmit?: () => void;
  onReset?: () => void;
}

export interface FormFieldProps extends LayoutProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export interface FormGroupProps extends LayoutProps {
  direction?: "horizontal" | "vertical";
}

/* =========================================================
 * DATA COMPONENTS
 * ======================================================= */

export interface TableColumn {
  key: string;
  title: string;
  width?: number;
  align?: "left" | "center" | "right";
}

export interface TableProps extends LayoutProps {
  columns: readonly TableColumn[];
  data: readonly Record<string, unknown>[];
  pageSize?: number;
  searchable?: boolean;
  striped?: boolean;
  bordered?: boolean;
  loading?: boolean;
  emptyText?: string;
  onRowClick?: (row: Record<string, unknown>) => void;
}

export interface ListProps extends LayoutProps {
  data?: readonly unknown[];
  ordered?: boolean;
}

export interface ListItemProps extends ClickableProps {
  value?: string | number;
}

export interface TreeNode {
  key: string;
  title: string;
  children?: readonly TreeNode[];
}

export interface TreeViewProps extends LayoutProps {
  data: readonly TreeNode[];
  selectedKey?: string;
  onSelect?: (key: string) => void;
}

/* =========================================================
 * MEDIA COMPONENTS
 * ======================================================= */

export interface ImageProps extends ClickableProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  fit?: "contain" | "cover" | "fill" | "none";
}

export interface IconProps extends VNodeProps {
  name: string;
  size?: number;
  color?: string;
}

export interface ProgressBarProps extends VNodeProps {
  value?: number;
  max?: number;
  color?: string;
  showValue?: boolean;
}

export interface SpinnerProps extends VNodeProps {
  size?: number;
  label?: string;
}

/* =========================================================
 * WINDOW AND NAVIGATION
 * ======================================================= */

export interface WindowProps extends LayoutProps {
  title?: string;
  x?: number;
  y?: number;
  resizable?: boolean;
  maximizable?: boolean;
  minimizable?: boolean;
  fullscreen?: boolean;
  onClose?: () => void;
}

export interface MenuItem {
  label: string;
  value?: string;
  disabled?: boolean;
  children?: readonly MenuItem[];
  onClick?: () => void;
}

export interface MenuProps extends VNodeProps {
  items: readonly MenuItem[];
}

export interface TabsProps extends LayoutProps {
  selectedKey?: string;
  onChange?: (key: string) => void;
}

export interface TabProps extends VNodeProps {
  title: string;
  tabKey: string;
  disabled?: boolean;
}

export interface DialogProps extends LayoutProps {
  title?: string;
  open?: boolean;
  modal?: boolean;
  onClose?: () => void;
}

export interface TooltipProps extends VNodeProps {
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
}
