// components/FilterBar.jsx
import { useState, useEffect } from 'react'
import {categoryToSpecMap} from '../../../shared/categoryToSpecMap'

const FilterBar = ({ 
  selectedCategory,
  setSelectedCategory,
  activeFilters,
  setActiveFilters 
}) => {
  const [availableFilters, setAvailableFilters] = useState([])

  // Update available filters when category changes
  useEffect(() => {
    if (selectedCategory && categoryToSpecMap[selectedCategory]) {
      const filters = Object.entries(categoryToSpecMap[selectedCategory])
        .filter(([_, value]) => Array.isArray(value))
      setAvailableFilters(filters)
    }
  }, [selectedCategory])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setActiveFilters({})
  }

  const handleFilterToggle = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: prev[filterKey]?.includes(value) 
        ? prev[filterKey].filter(v => v !== value)
        : [...(prev[filterKey] || []), value]
    }))
  }

  return (
    <div className="w-72 bg-gray-800 p-4 rounded-xl h-fit sticky top-24">
      {/* Category Selection */}
      <div className="mb-6">
        <h3 className="text-gray-100 font-medium mb-3">Select Category</h3>
        <div className="space-y-2">
          {Object.keys(categoryToSpecMap).map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Filters */}
      {selectedCategory && (
        <div className="space-y-6">
          {availableFilters.map(([filterKey, options]) => (
            <div key={filterKey}>
              <h4 className="text-gray-100 font-medium mb-2 capitalize">
                {filterKey.replace(/_/g, ' ')}
              </h4>
              <div className="space-y-2">
                {options.map(option => (
                  <label 
                    key={option} 
                    className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters[filterKey]?.includes(option)}
                      onChange={() => handleFilterToggle(filterKey, option)}
                      className="form-checkbox h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
                    />
                    {typeof option === 'boolean' ? 
                      (option ? 'Yes' : 'No') : 
                      option}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterBar