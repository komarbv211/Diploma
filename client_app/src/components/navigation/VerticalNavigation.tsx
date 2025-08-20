// src/components/navigation/VerticalCategoryNavigation.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Spin, Tree } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import { ICategory } from "../../types/category";
import { useGetCategoryTreeQuery } from "../../services/categoryApi";
import { useNavigate } from "react-router-dom";

interface VerticalNavigationProps {
  onSelectCategory?: () => void; // закриває Drawer при виборі категорії
}

const VerticalNavigation: React.FC<VerticalNavigationProps> = ({
  onSelectCategory,
}) => {
  const { data: allCategories, isLoading } = useGetCategoryTreeQuery();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]); // стан розгорнутих вузлів
  const navigate = useNavigate();

  const buildTreeData = useCallback((categories: ICategory[]): DataNode[] => {
    return categories.map((cat) => ({
      title: cat.name,
      key: cat.id,
      isLeaf: !cat.children || cat.children.length === 0,
      children: cat.children ? buildTreeData(cat.children) : [],
    }));
  }, []);

  useEffect(() => {
    if (allCategories) {
      const roots = allCategories.filter((cat) => !cat.parentId);
      setTreeData(buildTreeData(roots));
    }
  }, [allCategories, buildTreeData]);

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    const nodeKey = selectedKeys[0];
    if (!nodeKey) return;

    if (info.node.isLeaf) {
      // Листовий вузол — переходимо на сторінку
      navigate(`/category/${nodeKey}`);
      onSelectCategory?.();
    } else {
      // Батьківський вузол — перемикаємо розгортання
      setExpandedKeys((prev) =>
        prev.includes(nodeKey)
          ? prev.filter((k) => k !== nodeKey)
          : [...prev, nodeKey]
      );
    }
  };

  if (isLoading) return <Spin />;

  return (
    <nav className="w-64 bg-white shadow-sm rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Категорії</h3>
      <Tree
        treeData={treeData}
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        onSelect={onSelect}
        showLine
      />
    </nav>
  );
};

export default VerticalNavigation;
