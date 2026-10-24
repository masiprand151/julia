import type { Key, VNode, VNodeChild } from "../types";

export type NodePath = readonly number[];

export interface PropChanges {
  readonly set: Readonly<Record<string, unknown>>;
  readonly remove: readonly string[];
}

export type Patch =
  | {
      type: "REPLACE_NODE";
      path: NodePath;
      node: VNodeChild;
    }
  | {
      type: "UPDATE_PROPS";
      path: NodePath;
      changes: PropChanges;
    }
  | {
      type: "UPDATE_TEXT";
      path: NodePath;
      value: string | number;
    }
  | {
      type: "INSERT_CHILD";
      path: NodePath;
      index: number;
      node: VNodeChild;
    }
  | {
      type: "REMOVE_CHILD";
      path: NodePath;
      index: number;
    }
  | {
      type: "MOVE_CHILD";
      path: NodePath;
      from: number;
      to: number;
      key: Key;
    };

export interface DiffResult {
  readonly patches: readonly Patch[];
  readonly changed: boolean;
}

export interface DiffOptions {
  /**
   * Membatasi kedalaman traversal.
   * Tidak ditentukan berarti tidak ada batas khusus.
   */
  maxDepth?: number;

  /**
   * Memeriksa perubahan props menggunakan perbandingan
   * shallow, bukan deep comparison.
   */
  compareProps?: boolean;
}

export type DiffNode = VNode | VNodeChild;
