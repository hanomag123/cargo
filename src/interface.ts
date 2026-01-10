import type { HTMLAttributes, HTMLTag } from "astro/types";

export interface IUIBlockAttributes extends HTMLAttributes<"div"> {}
export interface IUIButtonAttributes extends HTMLAttributes<"a" | "button"> {
  href?: string;
}
export interface IUIInputAttributes
  extends HTMLAttributes<"input" | "textarea"> {}

export interface IUIComponent
  extends IUIBlockAttributes,
    IUIButtonAttributes,
    IUIInputAttributes {}

export interface IUIVariableComponent {
  component?: HTMLTag;
}
