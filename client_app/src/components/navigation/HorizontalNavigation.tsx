import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetRootCategoriesQuery,
  useGetChildrenByIdQuery,
} from "../../services/categoryApi";
import { Skeleton, Alert, Empty } from "antd";
const HorizontalNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<number | null>(
    null
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  const {
    data: rootCategories,
    isLoading,
    error,
  } = useGetRootCategoriesQuery();
  const { data: subcategories, isLoading: subcategoriesLoading } =
    useGetChildrenByIdQuery(hoveredCategory!, {
      skip: !hoveredCategory,
    });

  const handleCategoryMouseEnter = (categoryId: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredCategory(categoryId);
    setActiveSubcategory(null);
  };

  const handleCategoryMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
      setActiveSubcategory(null);
    }, 150);
  };

  const handleSubcategoryClick = (categoryId: number) => {
    setActiveSubcategory(categoryId);
    navigate(`/category/${categoryId}`);
    setHoveredCategory(null);
  };

  const handleSubmenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleSubmenuMouseLeave = () => {
    setHoveredCategory(null);
    setActiveSubcategory(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <nav className="nav-wrapper">
        <div className="nav-inner">
          <div className="h-12 px-5 flex items-center">
            <Skeleton.Input active size="small" style={{ width: 80 }} />
          </div>
        </div>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className="nav-wrapper">
        <div className="nav-inner">
          <div className="h-12 px-5 flex items-center justify-center w-full">
            <Alert
              message="Помилка завантаження категорій"
              type="error"
              showIcon
            />
          </div>
        </div>
      </nav>
    );
  }

  if (!rootCategories || rootCategories.length === 0) {
    return (
      <nav className="nav-wrapper">
        <div className="nav-inner">
          <div className="h-12 px-5 flex items-center justify-center w-full">
            <Empty description="Категорії не знайдено" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="nav-wrapper">
      <div className="nav-inner">
        <ul className="flex list-none m-0 p-0 h-12 items-center overflow-x-auto px-2 md:px-0">
          {rootCategories.map((category) => (
            <li
              key={category.id}
              className={`relative px-3 md:px-3 h-full flex items-center cursor-pointer transition-all duration-300 border-b-2 border-transparent hover:bg-gray-50 hover:border-pink2 flex-shrink-0 ${
                hoveredCategory === category.id ? "bg-gray-50 border-pink2" : ""
              }`}
              onMouseEnter={() => handleCategoryMouseEnter(category.id)}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <span className="font-manrope text-sm md:text-base font-medium text-gray-700 transition-colors duration-300 mr-1 whitespace-nowrap hover:text-pink2">
                {category.name}
              </span>
              {category.children && category.children.length > 0 && (
                <span className="text-xs text-gray-500 transition-all duration-300 ml-1 hover:text-pink2">
                  ▼
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Підменю з підкатегоріями */}
        {hoveredCategory && (subcategories || subcategoriesLoading) && (
          <div
            ref={submenuRef}
            className="absolute top-full left-0 right-0 bg-white border-t mt-[2px] shadow-lg z-50 animate-in slide-in-from-top-2 duration-300 max-h-96 overflow-y-auto"
            onMouseEnter={handleSubmenuMouseEnter}
            onMouseLeave={handleSubmenuMouseLeave}
          >
            <div className="max-w-full mx-auto p-5">
              {subcategoriesLoading ? (
                <div className="flex items-center justify-center py-10 gap-3 font-manrope text-gray text-sm">
                  <div className="w-5 h-5 border-2 border-gray border-t-pink2 rounded-full animate-spin"></div>
                  <span>Завантаження...</span>
                </div>
              ) : subcategories && subcategories.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 list-none m-0 p-0">
                  {subcategories.map((subcategory) => (
                    <li
                      key={subcategory.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-between hover:translate-x-1 ${
                        activeSubcategory === subcategory.id ? "bg-gray" : ""
                      }`}
                      onClick={() => handleSubcategoryClick(subcategory.id)}
                    >
                      <span className="font-manrope text-sm text-gray-600 transition-all duration-300 flex-1 whitespace-nowrap hover:text-pink2 hover:font-semibold">
                        {subcategory.name}
                      </span>
                      {subcategory.children &&
                        subcategory.children.length > 0 && (
                          <span className="text-xs text-gray-400 transition-all duration-300 ml-2 hover:text-pink2 hover:translate-x-1">
                            ▶
                          </span>
                        )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center py-10 font-manrope text-gray text-sm">
                  <span>Підкатегорії не знайдено</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HorizontalNavigation;
