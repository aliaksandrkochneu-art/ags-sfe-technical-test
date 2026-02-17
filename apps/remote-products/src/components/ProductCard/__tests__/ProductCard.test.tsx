import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import type { Product } from "@/types";

const mockProduct: Product = {
  id: "1",
  name: "Test Product",
  price: 49.99,
  category: "electronics",
  rating: 4.5,
  image: "https://example.com/product.jpg",
};

describe("ProductCard", () => {
  it("renders product name", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("renders product category", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("electronics")).toBeInTheDocument();
  });

  it("renders product price formatted as currency", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("$49.99")).toBeInTheDocument();
  });

  it("renders product image with alt text", () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByRole("img", { name: "Test Product" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/product.jpg");
  });

  it("renders image with lazy loading", () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("shows rating when showRating is true", () => {
    render(<ProductCard product={mockProduct} showRating />);
    expect(screen.getByText("⭐ 4.5")).toBeInTheDocument();
  });

  it("hides rating when showRating is false or omitted", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.queryByText(/⭐/)).not.toBeInTheDocument();
  });

  it("has listitem role for accessibility", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByRole("listitem")).toBeInTheDocument();
  });

  it("renders product with zero price", () => {
    const freeProduct = { ...mockProduct, price: 0 };
    render(<ProductCard product={freeProduct} />);
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });
});
