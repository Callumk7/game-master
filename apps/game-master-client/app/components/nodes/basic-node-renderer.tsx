import type { EntityType, NodeTree } from "@repo/api";
import { useState } from "react";

interface NodeRendererProps {
  node: NodeTree;
  depth?: number;
  maxDepth?: number;
  onNodeClick?: (node: NodeTree) => void;
  expandedNodes?: Set<string>;
  onToggleExpand?: (nodeId: string) => void;
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({
  node,
  depth = 0,
  maxDepth = 10,
  onNodeClick,
  expandedNodes = new Set(),
  onToggleExpand,
}) => {
  const nodeKey = `${node.type}:${node.id}`;
  const isExpanded = expandedNodes.has(nodeKey);
  const hasChildren = Object.keys(node.children).length > 0;
  const shouldRenderChildren = hasChildren && isExpanded && depth < maxDepth;

  const handleToggleExpand = () => {
    if (hasChildren && onToggleExpand) {
      onToggleExpand(nodeKey);
    }
  };

  const handleNodeClick = () => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  };

  return (
    <div className={`node-container depth-${depth}`}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className={`node-item ${node.type}`}
        onClick={handleNodeClick}
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        {hasChildren && (
          // biome-ignore lint/a11y/useButtonType: <explanation>
          <button
            className="expand-button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleExpand();
            }}
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        )}

        <NodeIcon type={node.type} />

        <span className="node-name">{node.name}</span>
        <span className="node-type">({node.type})</span>

        {hasChildren && (
          <span className="children-count">
            {Object.values(node.children).flat().length} relations
          </span>
        )}
      </div>

      {shouldRenderChildren && (
        <div className="node-children">
          {renderNodeChildren(node, depth + 1, {
            maxDepth,
            onNodeClick,
            expandedNodes,
            onToggleExpand,
          })}
        </div>
      )}
    </div>
  );
};

interface RenderChildrenOptions {
  maxDepth: number;
  onNodeClick?: (node: NodeTree) => void;
  expandedNodes: Set<string>;
  onToggleExpand?: (nodeId: string) => void;
}

function renderNodeChildren(
  parentNode: NodeTree,
  depth: number,
  options: RenderChildrenOptions,
): React.ReactNode {
  const { maxDepth, onNodeClick, expandedNodes, onToggleExpand } = options;

  return Object.entries(parentNode.children).map(([entityType, nodes]) => (
    <div key={entityType} className={`entity-group ${entityType}-group`}>
      <div className="entity-group-header">
        <strong>{entityType.charAt(0).toUpperCase() + entityType.slice(1)}s</strong>
        <span className="count">({nodes.length})</span>
      </div>

      <div className="entity-group-content">
        {nodes.map((childNode) => (
          <NodeRenderer
            key={`${childNode.type}:${childNode.id}`}
            node={childNode}
            depth={depth}
            maxDepth={maxDepth}
            onNodeClick={onNodeClick}
            expandedNodes={expandedNodes}
            onToggleExpand={onToggleExpand}
          />
        ))}
      </div>
    </div>
  ));
}

interface NodeIconProps {
  type: EntityType;
}

const NodeIcon: React.FC<NodeIconProps> = ({ type }) => {
  const iconMap = {
    characters: "👤",
    factions: "⚔",
    notes: "📝",
    folders: "📁",
  };

  return <span className="node-icon">{iconMap[type] || "❓"}</span>;
};

interface NodeTreeViewProps {
  rootNode: NodeTree;
  onNodeClick?: (node: NodeTree) => void;
  maxDepth?: number;
  defaultExpanded?: boolean;
}

export const NodeTreeView: React.FC<NodeTreeViewProps> = ({
  rootNode,
  onNodeClick,
  maxDepth = 5,
  defaultExpanded = false,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    if (defaultExpanded) {
      // Pre-expand all nodes up to a certain depth
      return new Set(getAllNodeKeys(rootNode, 2));
    }
    return new Set([`${rootNode.type}:${rootNode.id}`]); // Just expand root
  });

  const handleToggleExpand = (nodeKey: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeKey)) {
        newSet.delete(nodeKey);
      } else {
        newSet.add(nodeKey);
      }
      return newSet;
    });
  };

  const handleExpandAll = () => {
    setExpandedNodes(new Set(getAllNodeKeys(rootNode, maxDepth)));
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set([`${rootNode.type}:${rootNode.id}`]));
  };

  return (
    <div className="node-tree-view">
      <div className="tree-controls">
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button onClick={handleExpandAll}>Expand All</button>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button onClick={handleCollapseAll}>Collapse All</button>
      </div>

      <div className="tree-content">
        <NodeRenderer
          node={rootNode}
          depth={0}
          maxDepth={maxDepth}
          onNodeClick={onNodeClick}
          expandedNodes={expandedNodes}
          onToggleExpand={handleToggleExpand}
        />
      </div>
    </div>
  );
};

// Get all node keys up to a certain depth for pre-expansion
function getAllNodeKeys(node: NodeTree, maxDepth: number, currentDepth = 0): string[] {
  const keys = [`${node.type}:${node.id}`];

  if (currentDepth < maxDepth) {
    Object.values(node.children)
      .flat()
      .forEach((child) => {
        keys.push(...getAllNodeKeys(child, maxDepth, currentDepth + 1));
      });
  }

  return keys;
}

// Search functionality
export function searchNodeTree(node: NodeTree, searchTerm: string): NodeTree[] {
  const results: NodeTree[] = [];

  function searchRecursive(currentNode: NodeTree) {
    if (currentNode.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      results.push(currentNode);
    }

    Object.values(currentNode.children)
      .flat()
      .forEach((child) => {
        searchRecursive(child);
      });
  }

  searchRecursive(node);
  return results;
}
