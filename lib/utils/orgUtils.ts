// Utility: find a node by id

import { Node } from "@/lib/definitions/orgDefinitions";
export function findNodeById(node: Node, id: string): Node | null {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}
