// import { Link } from "react-router-dom";

// interface BreadcrumbsProps {
//   categoryName?: string;
// }

// const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ categoryName }) => {
//   return (
//     <nav className="text-sm text-gray-600 mb-4" aria-label="breadcrumbs">
//       <ol className="list-none p-0 inline-flex flex-wrap gap-1">
//         <li className="flex items-center">
//           <Link to="/" className="text-blue-600 hover:underline">Головна</Link>
//           <span className="mx-2">{">"}</span>
//         </li>
//         <li className="flex items-center">
//           <span className="text-gray-500">{categoryName || "Категорія"}</span>
//         </li>
//          <li className="flex items-center">
//           <span className="text-gray-500">{categoryName || "Підкатегорія"}</span>
//         </li>
//       </ol>
//     </nav>
//   );
// };

// export default Breadcrumbs;



import { Link } from "react-router-dom";
import { useGetCategoryTreeQuery } from "../../services/categoryApi";

interface Category {
  id: number;
  name: string;
  parentId: number | null;
}

interface BreadcrumbsProps {
  categoryId?: number;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ categoryId }) => {
  const { data: categories } = useGetCategoryTreeQuery();

  if (!categories || !categoryId) {
    return null;
  }

  // Рекурсивно будуємо шлях до кореня
  const buildBreadcrumbPath = (id: number, tree: Category[], path: Category[] = []): Category[] => {
    const current = tree.find((cat) => cat.id === id);
    if (current) {
      path.unshift(current); // Додаємо спочатку
      if (current.parentId) {
        return buildBreadcrumbPath(current.parentId, tree, path);
      }
    }
    return path;
  };

  const path = buildBreadcrumbPath(categoryId, categories);

  return (
    <nav className="text-sm text-gray-600 mb-4" aria-label="breadcrumbs">
      <ol className="list-none p-0 inline-flex flex-wrap gap-1 items-center">
        <li className="flex items-center">
          <Link to="/" className="text-pink hover:underline">Головна</Link>
          <span className="mx-2">{">"}</span>
        </li>
        {path.map((cat, index) => (
          <li key={cat.id} className="flex items-center">
            {index < path.length - 1 ? (
              <>
                <Link to={`/category/${cat.id}`} className="text-pink hover:underline">{cat.name}</Link>
                <span className="mx-2">{">"}</span>
              </>
            ) : (
              <span className="text-pink">{cat.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
