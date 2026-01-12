import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import SearchFilters from '../components/SearchFilters';
import ProductList from '../components/ProductList';
import Pagination from '../components/Pagination';

const Home = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, filters],
    queryFn: () =>
      productService.getProducts({
        page,
        limit: 12,
        ...filters,
      }),
    keepPreviousData: true,
  });

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Clothing Store</h1>
        <p>Discover the latest trends in fashion</p>
      </div>

      <div className="container">
        <SearchFilters onSearch={handleSearch} />
        
        {data && (
          <div className="results-info">
            <p>
              Showing {data.count} of {data.total} products
            </p>
          </div>
        )}

        <ProductList products={data?.data} loading={isLoading} />

        {data && data.pages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.pages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Home;