import React, { useState, useRef, useEffect } from 'react';
import { Check, X, ChevronDown, ChevronUp, Search } from 'lucide-react';

const MultiSelector = ({ options, value, onChange, placeholder = "Select items..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    const isSelected = value.find(item => item.value === option.value);
    if (isSelected) {
      onChange(value.filter(item => item.value !== option.value));
    } else {
      onChange([...value, option]);
    }
  };

  const removeItem = (optionToRemove) => {
    onChange(value.filter(item => item.value !== optionToRemove.value));
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        className="min-h-[42px] w-full bg-[#2c2e3b] rounded-lg border border-gray-700 p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {value.length === 0 && (
            <span className="text-gray-400">{placeholder}</span>
          )}
          {value.map((item) => (
            <span
              key={item.value}
              className="bg-purple-700 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm"
            >
              {item.label}
              <X
                size={14}
                className="cursor-pointer hover:text-red-400 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item);
                }}
              />
            </span>
          ))}
        </div>
        <div className="absolute right-2 top-3">
          {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#1c1b1e] border border-gray-700 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-700">
            <div className="relative">
              <Search size={18} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                type="text"
                className="w-full bg-[#2c2e3b] text-white rounded-md pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-purple-700"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="max-h-[200px] overflow-y-auto">
            {filteredOptions.map((option) => {
              const isSelected = value.find(item => item.value === option.value);
              return (
                <div
                  key={option.value}
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#292B4B] transition-colors
                    ${isSelected ? 'text-purple-400' : 'text-white'}`}
                  onClick={() => handleSelect(option)}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check size={18} />}
                </div>
              );
            })}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-2 text-gray-400">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelector;