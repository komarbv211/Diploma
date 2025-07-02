import React, { useEffect, useState, useCallback } from 'react';
import { TreeSelect, TreeSelectProps, Spin } from 'antd';
import { ICategory } from '../../types/category';
import { useGetChildrenByIdQuery, useGetCategoryTreeQuery } from '../../services/admin/categoryAdmnApi';

export interface CategoryTreeSelectProps extends Omit<TreeSelectProps, 'treeData' | 'loadData'> {
  highlightChildren?: boolean;
}

type DataNode = Exclude<TreeSelectProps['treeData'], undefined>[number];

const CategoryTreeSelect: React.FC<CategoryTreeSelectProps> = ({
  highlightChildren = true,
  ...props
}) => {
  const [treeData, setTreeData] = useState<TreeSelectProps['treeData']>([]);
  const { data: allCategories, isLoading } = useGetCategoryTreeQuery();
  const { data: children} = useGetChildrenByIdQuery(0, { skip: true });

  // Побудова дерева: root + діти підвантажуються
  const buildTreeData = useCallback((categories: ICategory[], parent?: ICategory): TreeSelectProps['treeData'] => {
    return categories.map(cat => {
      const isChild = !!parent;
      const style = highlightChildren && isChild ? { background: '#E6E6FA', borderRadius: 4, padding: '2px 6px' } : {};
      if (cat.children && cat.children.length > 0) {
        return {
          title: <span style={style}>{cat.name}</span>,
          value: cat.id,
          key: cat.id,
          isLeaf: false,
          selectable: false,
          children: buildTreeData(cat.children, cat)
        };
      }
      return {
        title: <span style={style}>{cat.name}</span>,
        value: cat.id,
        key: cat.id,
        isLeaf: true,
        selectable: true
      };
    });
  }, [highlightChildren]);

  useEffect(() => {
    if (allCategories) {
      const roots = allCategories.filter(cat => !cat.parentId);
      setTreeData(buildTreeData(roots));
    }
  }, [allCategories, buildTreeData]);

  // Оновлення дерева при підвантаженні дітей
  const updateTreeData = useCallback((list: TreeSelectProps['treeData'], key: React.Key, children: ICategory[]): TreeSelectProps['treeData'] => {
    return (list ?? []).map((node: DataNode) => {
      if (node.key === key) {
        return {
          ...node,
          children: buildTreeData(children, { id: Number(key) } as ICategory)
        };
      }
      if (node.children) {
        return { ...node, children: updateTreeData(node.children, key, children) };
      }
      return node;
    });
  }, [buildTreeData]);

  // Асинхронне підвантаження дітей
  const onLoadData = async (treeNode: DataNode): Promise<void> => {
    if (treeNode.children || treeNode.key === undefined) return;
    if (children) {
      setTreeData(origin => updateTreeData(origin, Number(treeNode.key), children));
    }
  };

  if (isLoading) return <Spin />;

  return (
    <TreeSelect
      treeData={treeData}
      loadData={onLoadData}
      showSearch
      allowClear
      placeholder="Оберіть категорію"
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      {...props}
    />
  );
};

export default CategoryTreeSelect; 