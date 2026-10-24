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
  /** Native WinForms-specific properties */
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

export type StyleValue = string | number | boolean | null;

export type StyleInput = Style | false | null | undefined | StyleInput[];

export type NamedStyles<T extends Record<string, Style>> = T;

export function createStyles<T extends Record<string, Style>>(
  styles: T,
): NamedStyles<T> {
  return styles;
}
