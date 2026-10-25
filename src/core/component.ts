import type {
  VNode,
  VNodeType,
  VNodeChild,
  VNodeProps,
  Key,
  Ref,
  ViewProps,
  ColumnProps,
  RowProps,
  ScrollViewProps,
  SpacerProps,
  DividerProps,
  TextProps,
  HeadingProps,
  LabelProps,
  ParagraphProps,
  LinkProps,
  ButtonProps,
  IconButtonProps,
  ButtonGroupProps,
  InputProps,
  TextAreaProps,
  CheckboxProps,
  RadioProps,
  SwitchProps,
  SelectProps,
  SliderProps,
  DatePickerProps,
  FormProps,
  FormFieldProps,
  FormGroupProps,
  TableProps,
  ListProps,
  ListItemProps,
  TreeViewProps,
  ImageProps,
  IconProps,
  ProgressBarProps,
  SpinnerProps,
  WindowProps,
  MenuProps,
  TabsProps,
  TabProps,
  DialogProps,
  TooltipProps,
} from "./types";

export const VNODE_TYPE = Symbol.for("julia.vnode");
export const Fragment = Symbol.for("julia.fragment");

type ElementInput = VNodeProps & Record<string, unknown>;

export function createElement<P = Record<string, unknown>>(
  type: VNodeType,
  props: P | null,
  ...children: VNodeChild[]
): VNode<P> {
  const input = {
    ...((props ?? {}) as object),
  } as ElementInput;

  const { key: rawKey, ref: rawRef, children: propsChildren, ...rest } = input;

  const normalizedChildren: VNodeChild[] =
    children.length > 0
      ? children
      : propsChildren == null
        ? []
        : Array.isArray(propsChildren)
          ? [...propsChildren]
          : [propsChildren as VNodeChild];

  return {
    $$typeof: VNODE_TYPE,
    type,
    kind: type === Fragment ? "fragment" : "element",
    key: (rawKey as Key | null | undefined) ?? null,
    ref: (rawRef as Ref<unknown> | undefined) ?? null,
    props: {
      ...rest,
      children: normalizedChildren,
    } as VNode<P>["props"],
    children: normalizedChildren,
  };
}

export function _e<P = Record<string, unknown>>(
  type: VNodeType,
  props: P | null,
): VNode<P> {
  return createElement(type, props);
}

/* Layout */

export function View(props: ViewProps): VNode<ViewProps> {
  return _e("view", props);
}

export function Column(props: ColumnProps): VNode<ColumnProps> {
  return _e("column", props);
}

export function Row(props: RowProps): VNode<RowProps> {
  return _e("row", props);
}

export function ScrollView(props: ScrollViewProps): VNode<ScrollViewProps> {
  return _e("scroll-view", props);
}

export function Spacer(props: SpacerProps = {}): VNode<SpacerProps> {
  return _e("spacer", props);
}

export function Divider(props: DividerProps = {}): VNode<DividerProps> {
  return _e("divider", props);
}

/* Text */

export function Text(
  text: string,
  props: TextProps = { text: "" },
): VNode<TextProps> {
  props.text = text;
  return _e("text", props);
}

export function Heading(props: HeadingProps): VNode<HeadingProps> {
  return _e("heading", props);
}

export function Label(props: LabelProps): VNode<LabelProps> {
  return _e("label", props);
}

export function Paragraph(props: ParagraphProps): VNode<ParagraphProps> {
  return _e("paragraph", props);
}

export function Link(props: LinkProps): VNode<LinkProps> {
  return _e("link", props);
}

/* Buttons */

export function Button(props: ButtonProps): VNode<ButtonProps> {
  return _e("button", props);
}

export function IconButton(props: IconButtonProps): VNode<IconButtonProps> {
  return _e("icon-button", props);
}

export function ButtonGroup(props: ButtonGroupProps): VNode<ButtonGroupProps> {
  return _e("button-group", props);
}

/* Inputs */

export function Input(props: InputProps): VNode<InputProps> {
  return _e("input", props);
}

export function TextArea(props: TextAreaProps): VNode<TextAreaProps> {
  return _e("textarea", props);
}

export function Checkbox(props: CheckboxProps): VNode<CheckboxProps> {
  return _e("checkbox", props);
}

export function Radio(props: RadioProps): VNode<RadioProps> {
  return _e("radio", props);
}

export function Switch(props: SwitchProps): VNode<SwitchProps> {
  return _e("switch", props);
}

export function Select(props: SelectProps): VNode<SelectProps> {
  return _e("select", props);
}

export function Slider(props: SliderProps): VNode<SliderProps> {
  return _e("slider", props);
}

export function DatePicker(props: DatePickerProps): VNode<DatePickerProps> {
  return _e("date-picker", props);
}

/* Forms */

export function Form(props: FormProps): VNode<FormProps> {
  return _e("form", props);
}

export function FormField(props: FormFieldProps): VNode<FormFieldProps> {
  return _e("form-field", props);
}

export function FormGroup(props: FormGroupProps): VNode<FormGroupProps> {
  return _e("form-group", props);
}

/* Data */

export function Table(props: TableProps): VNode<TableProps> {
  return _e("table", props);
}

export function List(props: ListProps): VNode<ListProps> {
  return _e("list", props);
}

export function ListItem(props: ListItemProps): VNode<ListItemProps> {
  return _e("list-item", props);
}

export function TreeView(props: TreeViewProps): VNode<TreeViewProps> {
  return _e("tree-view", props);
}

/* Media */

export function Image(props: ImageProps): VNode<ImageProps> {
  return _e("image", props);
}

export function Icon(props: IconProps): VNode<IconProps> {
  return _e("icon", props);
}

export function ProgressBar(props: ProgressBarProps): VNode<ProgressBarProps> {
  return _e("progress-bar", props);
}

export function Spinner(props: SpinnerProps = {}): VNode<SpinnerProps> {
  return _e("spinner", props);
}

/* Window and navigation */

export function Window(props: WindowProps): VNode<WindowProps> {
  return _e("window", props);
}

export function Menu(props: MenuProps): VNode<MenuProps> {
  return _e("menu", props);
}

export function Tabs(props: TabsProps): VNode<TabsProps> {
  return _e("tabs", props);
}

export function Tab(props: TabProps): VNode<TabProps> {
  return _e("tab", props);
}

export function Dialog(props: DialogProps): VNode<DialogProps> {
  return _e("dialog", props);
}

export function Tooltip(props: TooltipProps): VNode<TooltipProps> {
  return _e("tooltip", props);
}
