import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Plane, ChevronDown, Check } from 'lucide-react';
import { searchCities, CitySuggestion } from '../data/cities';

interface CityAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: 'map' | 'nav';
  required?: boolean;
  mode?: 'roadtrip' | 'workation' | 'standard';
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  label,
  value,
  onChange,
  placeholder,
  icon = 'map',
  required = false,
  mode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update suggestions on query change
  useEffect(() => {
    if (value.trim().length > 0) {
      const results = searchCities(value, 8, mode);
      setSuggestions(results);
    } else {
      // Default popular cities
      setSuggestions(searchCities('', 8, mode));
    }
  }, [value, mode]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CitySuggestion) => {
    onChange(city.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
        {icon === 'nav' ? (
          <Navigation className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
        )}
        <span>{label}</span>
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          required={required}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full pl-3.5 pr-8 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-900 text-sm font-medium transition-all bg-white"
        />

        <button
          type="button"
          tabIndex={-1}
          onClick={() => {
            setIsOpen(!isOpen);
            inputRef.current?.focus();
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-xl border border-slate-200/90 max-h-72 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-1.5">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
              <span>{value.trim().length > 0 ? 'Варианты по запросу:' : 'Популярные направления:'}</span>
              <span className="text-[9px] font-normal lowercase">{suggestions.length} найдено</span>
            </div>

            {suggestions.length === 0 ? (
              <div className="px-4 py-3 text-xs text-slate-500 text-center">
                Город не найден в базе, но вы можете оставить введённый вариант: <strong>{value}</strong>
              </div>
            ) : (
              suggestions.map((city, idx) => {
                const isSelected = value.toLowerCase() === city.name.toLowerCase();
                const isHighlighted = idx === highlightedIndex;

                return (
                  <div
                    key={`${city.name}-${city.country}-${idx}`}
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevents blur before click
                      handleSelect(city);
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors ${
                      isHighlighted || isSelected
                        ? 'bg-emerald-50/90 text-emerald-950 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        city.country === 'Россия' ? 'bg-slate-100 text-slate-600' : 'bg-teal-50 text-teal-700'
                      }`}>
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-slate-900 flex items-center gap-1.5">
                          <span>{city.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {city.country} {city.region ? `• ${city.region}` : ''}
                        </div>
                      </div>
                    </div>

                    {city.iata && (
                      <span className="shrink-0 text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                        {city.iata}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
