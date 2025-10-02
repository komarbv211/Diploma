
import { Link } from "react-router-dom";
import { useGetCategoryTreeQuery } from "../../services/categoryApi";

interface Crumb {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  parentId: number | null;
}

interface BreadcrumbsProps {
  path?: Crumb[];           // ✅ Готовий шлях (можна передати ззовні)
  categoryId?: number;      // ✅ ІД категорії (якщо хочеш збудувати автоматично)
  productName?: string;     // ✅ Назва товару (останній елемент)
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  path,
  categoryId,
  productName,
}) => {
  const { data: categories } = useGetCategoryTreeQuery();

  // Якщо передано готовий шлях — використовуємо його
  const builtPath: Crumb[] = (() => {
    if (path) return path;

    if (!categories || !categoryId) return [];

    const buildBreadcrumbPath = (
      id: number,
      tree: Category[],
      result: Crumb[] = []
    ): Crumb[] => {
      const current = tree.find((cat) => cat.id === id);
      if (current) {
        result.unshift({ id: current.id, name: current.name });
        if (current.parentId) {
          return buildBreadcrumbPath(current.parentId, tree, result);
        }
      }
      return result;
    };

    return buildBreadcrumbPath(categoryId, categories);
  })();

  // Якщо немає шляху — нічого не показуємо
  if (!builtPath.length && !productName) return null;

  return (
    <nav className="text-sm text-gray-600 mb-4" aria-label="breadcrumbs">
      <ol className="list-none p-0 inline-flex flex-wrap gap-1 items-center">
        <li className="flex items-center">
          <Link to="/" className="text-pink hover:underline">
            Головна
          </Link>
          <span className="mx-2">{">"}</span>
        </li>

        {builtPath.map((crumb, index) => (
          <li key={crumb.id} className="flex items-center">
            {index < builtPath.length - 1 || productName ? (
              <>
                <Link
                  to={`/category/${crumb.id}`}
                  className="text-pink hover:underline"
                >
                  {crumb.name}
                </Link>
                <span className="mx-2">{">"}</span>
              </>
            ) : (
              <span className="text-pink">{crumb.name}</span>
            )}
          </li>
        ))}

        {productName && (
          <li className="flex items-center">
            <span className="text-pink">{productName}</span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
