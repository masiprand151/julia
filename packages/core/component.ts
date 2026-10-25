import type {
  VNode,
  VNodeType,
  VNodeChild,
  VNodeProps,
  Key,
  Ref,
  ViewProps,
  ContainerProps,
  CenterProps,
  ExpandedProps,
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
  classNameType,
} from "./types";

/* VNODE CONSTANTS */

export const VNODE_TYPE = Symbol.for("julia.vnode");
export const Fragment = Symbol.for("julia.fragment");

type ElementInput = VNodeProps & Record<string, unknown>;

let autoClassCounter = 0;

/* VNODE CREATION */

export function createElement<P = Record<string, unknown>>(
  type: VNodeType,
  props: P | null,
  ...children: VNodeChild[]
): VNode<P> {
  const input = { ...((props ?? {}) as object) } as ElementInput;

  const {
    key: rawKey,
    ref: rawRef,
    className: rawClass,
    children: propsChildren,
    ...rest
  } = input;

  const normalizedChildren: VNodeChild[] =
    children.length > 0
      ? children
      : propsChildren == null
        ? []
        : Array.isArray(propsChildren)
          ? ([...propsChildren] as VNodeChild[])
          : [propsChildren as VNodeChild];

  let resolvedClassName: classNameType | "";

  if (type === Fragment) {
    resolvedClassName = "";
  } else if (rawClass != null) {
    resolvedClassName = rawClass as classNameType;
  } else {
    resolvedClassName =
      `${String(type)}_${++autoClassCounter}` as classNameType;
  }

  return {
    $$typeof: VNODE_TYPE,
    type,
    kind: type === Fragment ? "fragment" : "element",
    key: (rawKey as Key | null | undefined) ?? null,
    ref: (rawRef as Ref<unknown> | undefined) ?? null,
    className: resolvedClassName,
    props: {
      ...rest,
      children: normalizedChildren,
    } as VNode<P>["props"],
    children: normalizedChildren,
  };
}

export function _e<P = Record<string, unknown>>(
  type: VNodeType,
  props: P | null = null,
): VNode<P> {
  return createElement<P>(type, props);
}

/* LAYOUT COMPONENTS */

export function View(props: ViewProps): VNode<ViewProps> {
  return _e("view", props);
}

export function Container(props: ContainerProps): VNode<ContainerProps> {
  return _e("container", props);
}

export function Center(props: CenterProps): VNode<CenterProps> {
  return _e("center", props);
}

export function Expanded(props: ExpandedProps): VNode<ExpandedProps> {
  return _e("expanded", {
    flex: 1,
    ...props,
  });
}

export function Column(props: ColumnProps): VNode<ColumnProps> {
  return _e("column", props);
}

export function Row(props: RowProps): VNode<RowProps> {
  return _e("row", props);
}

export function ScrollView(props: ScrollViewProps): VNode<ScrollViewProps> {
  return _e("scrollview", props);
}

export function Spacer(props: SpacerProps = {}): VNode<SpacerProps> {
  return _e("spacer", props);
}

export function Divider(props: DividerProps = {}): VNode<DividerProps> {
  return _e("divider", props);
}

/* TEXT COMPONENTS */

export function Text(
  text: string,
  props: TextProps = { text: "" },
): VNode<TextProps> {
  return _e("text", {
    ...props,
    text,
  });
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

/* BUTTON COMPONENTS */

export function Button(props: ButtonProps): VNode<ButtonProps> {
  return _e("button", props);
}

export function IconButton(props: IconButtonProps): VNode<IconButtonProps> {
  return _e("icon-button", props);
}

export function ButtonGroup(props: ButtonGroupProps): VNode<ButtonGroupProps> {
  return _e("button-group", props);
}

/* INPUT COMPONENTS */

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

/* FORM COMPONENTS */

export function Form(props: FormProps): VNode<FormProps> {
  return _e("form", props);
}

export function FormField(props: FormFieldProps): VNode<FormFieldProps> {
  return _e("form-field", props);
}

export function FormGroup(props: FormGroupProps): VNode<FormGroupProps> {
  return _e("form-group", props);
}

/* DATA COMPONENTS */

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

/* MEDIA COMPONENTS */

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

/* WINDOW AND NAVIGATION */

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
