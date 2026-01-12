import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const SearchFilters = ({ onFilterChange, onSearch }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    size: '',
    minPrice: '',
    maxPrice: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      size: '',
      minPrice: '',
      maxPrice: '',
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div className="search-filters">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <Search size={20} />
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="search-btn">
          Search
        </button>
        <button
          type="button"
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={20} />
          Filters
        </button>
      </form>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleInputChange}
            >
              <option value="">All Categories</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Size</label>
            <select
              name="size"
              value={filters.size}
              onChange={handleInputChange}
            >
              <option value="">All Sizes</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Min Price ($)</label>
            <input
              type="number"
              name="minPrice"
              placeholder="0"
              value={filters.minPrice}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          <div className="filter-group">
            <label>Max Price ($)</label>
            <input
              type="number"
              name="maxPrice"
              placeholder="1000"
              value={filters.maxPrice}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          <button
            type="button"
            className="clear-filters-btn"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;