import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductList from "@/components/ProductList/ProductList";
import type { Product } from "@/types";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Laptop",
    price: 999.99,
    category: "electronics",
    rating: 4.5,
    image: "https://example.com/laptop.jpg",
  },
  {
    id: "2",
    name: "Coffee Maker",
    price: 49.99,
    category: "kitchen",
    rating: 4.2,
    image: "https://example.com/coffee.jpg",
  },
];

const mockSetQuery = vi.fn();
const mockSetCategory = vi.fn();
const mockSetSort = vi.fn();
const mockResetFilters = vi.fn();

vi.mock("@/msw/browser", () => ({
  startWorker: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/components/ProductsApiContext", () => ({
  useProductsApi: () => ({ loaded: true }),
  ProductsApiProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

vi.mock("@/hooks", () => ({
  useProducts: () => ({
    all: mockProducts,
    filteredProducts: mockProducts,
    categories: ["all", "electronics", "kitchen"],
    isLoading: false,
    query: "",
    category: "all",
    sort: "asc",
    setQuery: mockSetQuery,
    setCategory: mockSetCategory,
    setSort: mockSetSort,
    resetFilters: mockResetFilters,
  }),
  useVirtualizedGrid: () => ({
    parentRef: { current: null },
    columns: 2,
    GAP: 16,
    virtualizer: {
      getTotalSize: () => 300,
      getVirtualItems: () => [{ index: 0, start: 0, size: 296, key: "row-0" }],
    },
  }),
}));

vi.mock("@/components/ProductCard/ProductCard", () => ({
  ProductCard: ({ product }: { product: Product }) => (
    <div role="listitem" data-testid={`product-${product.id}`}>
      {product.name}
    </div>
  ),
}));

describe("ProductList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the product list container", () => {
    render(<ProductList />);
    expect(
      screen.getByRole("region", { name: "Product filters" }),
    ).toBeInTheDocument();
  });

  it("renders a search input", () => {
    render(<ProductList />);
    expect(screen.getByPlaceholderText("Search products…")).toBeInTheDocument();
  });

  it("renders the results count", () => {
    render(<ProductList />);
    expect(screen.getByText("Showing 2 of 2 products")).toBeInTheDocument();
  });

  it("renders product cards via the mocked grid", () => {
    render(<ProductList />);
    expect(screen.getByTestId("product-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-2")).toBeInTheDocument();
  });

  it("calls setQuery when typing in search input", async () => {
    const user = userEvent.setup();
    render(<ProductList />);

    const input = screen.getByPlaceholderText("Search products…");
    await user.type(input, "L");

    expect(mockSetQuery).toHaveBeenCalled();
  });

  it("calls resetFilters when Reset button is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductList />);

    const resetButton = screen.getByRole("button", {
      name: "Reset all filters",
    });
    await user.click(resetButton);

    expect(mockResetFilters).toHaveBeenCalledTimes(1);
  });

  it("renders the product grid with list role", () => {
    render(<ProductList />);
    expect(
      screen.getByRole("list", { name: "Product list" }),
    ).toBeInTheDocument();
  });

  it("has an accessible results count with aria-live", () => {
    render(<ProductList />);
    const resultsDiv = screen.getByText("Showing 2 of 2 products");
    expect(resultsDiv).toHaveAttribute("aria-live", "polite");
    expect(resultsDiv).toHaveAttribute("aria-atomic", "true");
  });
});
