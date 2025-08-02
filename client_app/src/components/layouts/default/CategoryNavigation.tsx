import React, { useState, useEffect } from "react";
import { Menu, Spin } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetCategoryTreeQuery } from "../../../services/categoryApi"; // або свій шлях
import { buildCategoryMenu } from "../../../utilities/menuBuilder"; // функція з кроку 1
import { MenuItem } from "../../../types/category";

const CategoryNavigation: React.FC = () => {
  const navigate = useNavigate();
  const { data: categoryTree, isLoading } = useGetCategoryTreeQuery();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (categoryTree) {
      const items = buildCategoryMenu(categoryTree);
      setMenuItems(items);
    }
  }, [categoryTree]);

  const handleClick: MenuProps["onClick"] = (e) => {
    // Наприклад, навігація до сторінки категорії
    navigate(`/categories/${e.key}`);
  };

  if (isLoading) return <Spin />;

  return (
    <Menu
      mode="inline"
      theme="light"
      items={menuItems}
      onClick={handleClick}
      style={{ width: 256 }}
    />
  );
};

export default CategoryNavigation;
