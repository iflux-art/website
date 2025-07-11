import { ID } from "@/types/base-types";

export interface Command {
  id: ID;
  title: string;
  description: string;
  action: () => void;
  shortcut?: string;
  group?: string;
}
