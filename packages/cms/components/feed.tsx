import type { ComponentType, ReactNode } from "react";
import { Pump } from "basehub/react-pump";

/**
 * Re-typed wrapper: BaseHub's Pump generics only line up with its
 * token-generated types. With the committed stub types (tokenless builds)
 * the raw query objects don't overlap, so we loosen the contract here.
 */
export type FeedProps = {
  queries: unknown[];
  children: (data: any) => ReactNode;
  [key: string]: unknown;
};

export const Feed = Pump as unknown as ComponentType<FeedProps>;
