import { QWidget } from "@nodegui/nodegui";

export type Dimension = number | string;
export type ColorValue = string;

export type FlexDirection = "row" | "column";

export type AlignItems =
  | "flex-start"
  | "center"
  | "flex-end"
  | "stretch"
  | "baseline";

export type JustifyContent =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "space-evenly";

export type PositionType = "relative" | "absolute";
export type OverflowType = "visible" | "hidden" | "scroll";

export type FontWeight = "normal" | "bold" | "light" | "medium" | number;

export type TextAlign = "left" | "center" | "right" | "justify";

export type BorderStyle = "none" | "solid" | "dashed" | "dotted";

export type StyleTarget = "QWidget" | "QPushButton" | "QLabel" | "QScrollArea";

export interface SpacingStyle {
  margin?: Dimension;
  marginTop?: Dimension;
  marginRight?: Dimension;
  marginBottom?: Dimension;
  marginLeft?: Dimension;

  padding?: Dimension;
  paddingTop?: Dimension;
  paddingRight?: Dimension;
  paddingBottom?: Dimension;
  paddingLeft?: Dimension;
}

export interface SizeStyle {
  width?: Dimension;
  height?: Dimension;

  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;

  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: Dimension;

  aspectRatio?: number;
}

export interface FlexStyle {
  display?: "flex" | "none";

  flexDirection?: FlexDirection;
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";

  alignItems?: AlignItems;
  alignSelf?: AlignItems | "auto";

  justifyContent?: JustifyContent;

  gap?: number;
  rowGap?: number;
  columnGap?: number;
}

export interface PositionStyle {
  position?: PositionType;

  top?: Dimension;
  right?: Dimension;
  bottom?: Dimension;
  left?: Dimension;

  zIndex?: number;
}

export interface BackgroundStyle {
  backgroundColor?: ColorValue;
  opacity?: number;
}

export interface BorderStyleProps {
  borderWidth?: number;
  borderColor?: ColorValue;
  borderStyle?: BorderStyle;
  borderRadius?: number;

  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;

  borderTopColor?: ColorValue;
  borderRightColor?: ColorValue;
  borderBottomColor?: ColorValue;
  borderLeftColor?: ColorValue;
}

export interface TypographyStyle {
  color?: ColorValue;

  fontSize?: number;
  fontFamily?: string;
  fontWeight?: FontWeight;
  fontStyle?: "normal" | "italic";

  textAlign?: TextAlign;
  textDecorationLine?: "none" | "underline" | "line-through";

  lineHeight?: number;
  letterSpacing?: number;

  whiteSpace?: "normal" | "nowrap" | "pre-wrap";
}

export interface VisibilityStyle {
  visible?: boolean;
  overflow?: OverflowType;
  cursor?: "default" | "pointer" | "text" | "wait";
}

export interface NativeStyle {
  dock?: "none" | "top" | "bottom" | "left" | "right" | "fill";

  anchor?: Array<"top" | "bottom" | "left" | "right">;

  tabIndex?: number;
}

export interface Style
  extends
    SpacingStyle,
    SizeStyle,
    FlexStyle,
    PositionStyle,
    BackgroundStyle,
    BorderStyleProps,
    TypographyStyle,
    VisibilityStyle,
    NativeStyle {}

/**
 * Nested selector yang didukung oleh API style Julia.
 *
 * Contoh:
 * ":hover"
 * ":pressed"
 * ":disabled"
 * "& > *:hover"
 * "& .child"
 * ".primary"
 * "#special"
 */
export type NestedSelector =
  | `:${string}`
  | `&${string}`
  | `>${string}`
  | `.${string}`
  | `#${string}`;

/**
 * Style biasa ditambah nested selector rekursif.
 */
export type StyleDefinition = Style & {
  [K in NestedSelector]?: StyleDefinition;
};

export type StyleValue = string | number | false | null;

export type StyleInput =
  | StyleDefinition
  | false
  | null
  | undefined
  | StyleInput[];

export type NamedStyles<T extends Record<string, StyleDefinition>> = T;

/* =====================================================
 * INTERNAL HELPERS
 * ===================================================== */

const nestedSelectorPrefixes = [":", "&", ">", ".", "#"];

function isNestedSelector(property: string): boolean {
  return nestedSelectorPrefixes.some((prefix) => property.startsWith(prefix));
}

function isStyleObject(value: unknown): value is StyleDefinition {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeStyleDefinitions(
  target: StyleDefinition,
  source: StyleDefinition,
): StyleDefinition {
  const result: Record<string, unknown> = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) {
      continue;
    }

    if (
      isNestedSelector(key) &&
      isStyleObject(value) &&
      isStyleObject(result[key])
    ) {
      result[key] = mergeStyleDefinitions(
        result[key] as StyleDefinition,
        value,
      );
    } else {
      result[key] = value;
    }
  }

  return result as StyleDefinition;
}

/* =====================================================
 * STYLESHEET API
 * ===================================================== */

export function createStyles<T extends Record<string, StyleDefinition>>(
  styles: T,
): NamedStyles<T> {
  return styles;
}

export const StyleSheet = {
  create<T extends Record<string, StyleDefinition>>(styles: T): NamedStyles<T> {
    return styles;
  },

  flatten(style?: StyleInput): StyleDefinition {
    if (style == null || style === false) {
      return {};
    }

    if (Array.isArray(style)) {
      return style.reduce<StyleDefinition>((result, item) => {
        return mergeStyleDefinitions(result, StyleSheet.flatten(item));
      }, {});
    }

    return style;
  },

  compose(style1?: StyleInput, style2?: StyleInput): StyleDefinition {
    return mergeStyleDefinitions(
      StyleSheet.flatten(style1),
      StyleSheet.flatten(style2),
    );
  },
};

/* =====================================================
 * STYLE PARSER
 *
 * Mengubah deklarasi style menjadi Qt Style Sheets.
 * Layout tetap ditangani oleh layout engine Julia.
 * ===================================================== */

const unitlessProperties = new Set(["opacity", "fontWeight", "zIndex"]);

const layoutProperties = new Set([
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",

  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",

  "flex",
  "flexGrow",
  "flexShrink",
  "flexBasis",
  "flexDirection",
  "flexWrap",

  "alignItems",
  "alignSelf",
  "justifyContent",

  "gap",
  "rowGap",
  "columnGap",
  "aspectRatio",

  "position",
  "top",
  "right",
  "bottom",
  "left",
  "zIndex",

  "display",
  "visible",
  "overflow",
  "cursor",

  "dock",
  "anchor",
  "tabIndex",

  "whiteSpace",
  "lineHeight",
  "letterSpacing",
]);

function toKebabCase(property: string): string {
  return property.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

function formatValue(property: string, value: StyleValue): string | null {
  if (value === null || value === false) {
    return null;
  }

  if (typeof value === "number") {
    if (value === 0 || unitlessProperties.has(property)) {
      return String(value);
    }

    return `${value}px`;
  }

  return value;
}

function addRule(rules: string[], property: string, value: StyleValue): void {
  const formattedValue = formatValue(property, value);

  if (formattedValue === null) {
    return;
  }

  rules.push(`${toKebabCase(property)}: ${formattedValue};`);
}

function normalizeFontWeight(value: unknown): StyleValue {
  if (typeof value === "number") {
    return value >= 600 ? "bold" : "normal";
  }

  if (value === "medium") {
    return "bold";
  }

  if (value === "normal" || value === "bold" || value === "light") {
    return value;
  }

  return "normal";
}

function isPaddingProperty(property: string): boolean {
  return (
    property === "padding" ||
    property === "paddingTop" ||
    property === "paddingRight" ||
    property === "paddingBottom" ||
    property === "paddingLeft"
  );
}

function shouldUseQssPadding(target: StyleTarget): boolean {
  return target === "QPushButton";
}

/**
 * Mengubah style menjadi deklarasi QSS.
 *
 * QWidget:
 *   padding diproses layout engine Julia.
 *
 * QPushButton:
 *   padding diproses melalui QSS.
 *
 * Nested selector tidak ikut dimasukkan ke deklarasi.
 */
export function parseStyle(
  style?: StyleInput,
  target: StyleTarget = "QWidget",
): string {
  if (style == null || style === false) {
    return "";
  }

  if (Array.isArray(style)) {
    return style
      .map((item) => parseStyle(item, target))
      .filter(Boolean)
      .join("\n");
  }

  const rules: string[] = [];

  for (const [property, value] of Object.entries(style)) {
    if (
      value === undefined ||
      value === null ||
      value === false ||
      isNestedSelector(property)
    ) {
      continue;
    }

    if (layoutProperties.has(property)) {
      continue;
    }

    if (isPaddingProperty(property)) {
      if (!shouldUseQssPadding(target)) {
        continue;
      }
    }

    if (property === "fontWeight") {
      addRule(rules, "fontWeight", normalizeFontWeight(value));
      continue;
    }

    if (property === "textDecorationLine") {
      // Ditangani khusus oleh runtime jika diperlukan.
      continue;
    }

    if (property === "opacity") {
      // Tidak diterapkan di sini karena dukungannya
      // bergantung pada jenis widget dan runtime Qt.
      continue;
    }

    addRule(rules, property, value as StyleValue);
  }

  return rules.join("\n");
}

/* =====================================================
 * NESTED SELECTOR COMPILER
 * ===================================================== */

/**
 * Mengompilasi style dan nested selector menjadi QSS.
 *
 * Contoh:
 * ":hover"
 *   -> QPushButton#myButton:hover
 *
 * "& > *:hover"
 *   -> QPushButton#myButton > *:hover
 */
export function compileStyleSheet(
  style?: StyleInput,
  selector = "QWidget",
  target: StyleTarget = "QWidget",
): string {
  if (style == null || style === false) {
    return "";
  }

  const unsupportedProperties = new Set(["yBorder"]);

  if (Array.isArray(style)) {
    return style
      .map((item) => compileStyleSheet(item, selector, target))
      .filter(Boolean)
      .join("\n");
  }

  const definition = StyleSheet.flatten(style);
  const output: string[] = [];

  const declarations = parseStyle(definition, target);

  if (declarations) {
    output.push(`${selector} {\n${declarations}\n}`);
  }

  for (const [nestedSelector, nestedStyle] of Object.entries(definition)) {
    if (
      !isNestedSelector(nestedSelector) ||
      !isStyleObject(nestedStyle) ||
      unsupportedProperties.has(nestedSelector)
    ) {
      continue;
    }

    const expandedSelector = nestedSelector.includes("&")
      ? nestedSelector.replace(/&/g, selector)
      : `${selector}${nestedSelector}`;

    const nestedRules = compileStyleSheet(
      nestedStyle,
      expandedSelector,
      target,
    );

    if (nestedRules) {
      output.push(nestedRules);
    }
  }

  return output.join("\n");
}

function applyGapToChild(
  child: QWidget,
  gap: number,
  index: number,
  total: number,
): void {
  if (total <= 1 || gap <= 0) return;

  // Margin separuh gap di setiap sisi widget.
  const halfGap = Math.floor(gap / 2);

  child.setContentsMargins(0, 0, 0, 0);

  // Ini bukan margin Yoga; gunakan hanya jika widget memang
  // tidak dikendalikan FlexLayout.
}

// example

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "column",
//     padding: 20,
//     gap: 10,
//     backgroundColor: "#202020",
//   },

//   title: {
//     color: "#ffffff",
//     fontSize: 24,
//     fontWeight: "bold",
//   },

//   button: {
//     backgroundColor: "#2563eb",
//     color: "#ffffff",
//     padding: 10,
//     borderRadius: 8,

//     ":hover": {
//       backgroundColor: "#1d4ed8",
//     },

//     ":pressed": {
//       backgroundColor: "#1e40af",
//     },

//     ":disabled": {
//       backgroundColor: "#888888",
//     },
//   },
// });

// const qss = compileStyleSheet(
//   styles.button,
//   "QPushButton#juliaButton",
//   "QPushButton",
// );

// console.log(qss);
