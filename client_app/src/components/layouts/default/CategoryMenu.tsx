// src/components/layouts/default/CategoryMenu.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCategoryTreeQuery } from "../../../services/categoryApi";
import { buildCategoryMenu } from "../../../utilities/menuBuilder";
import { MenuItem } from "../../../types/category";

const CategoryMenu: React.FC = () => {
  const navigate = useNavigate();
  const { data: categoryTree, isLoading } = useGetCategoryTreeQuery();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (categoryTree) {
      const items = buildCategoryMenu(categoryTree);
      setMenuItems(items);
    }
  }, [categoryTree]);

  const handleClick = (urlSlug: string) => {
    navigate(`/categories/${urlSlug}`);
  };

  if (isLoading) return null;

  return (
    <nav className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[1277px] h-[48px] flex items-center gap-[60px] z-40 bg-white">
      {menuItems.map((item) => (
        <span
          key={item.key}
          onClick={() => handleClick(item.urlSlug)}
          className="text-black text-[18px] font-medium font-[Manrope] opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
        >
          {item.label}
        </span>
      ))}
    </nav>
  );
};

export default CategoryMenu;
