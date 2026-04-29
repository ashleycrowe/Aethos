import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { Search, Filter, History, Trash2, Globe, Slack, Database, Box, HardDrive, MoreVertical, Check, ChevronDown, X as CloseIcon } from 'lucide-react';

export interface GridColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
}

interface OperationalGridProps {
  title?: string;
  subtitle?: string;
  columns: GridColumn[];
  data: any[];
  onSearch?: (term: string) => void;
  filterCategories?: FilterCategory[];
  onFilterChange?: (filters: Record<string, string[]>) => void;
  renderCell?: (item: any, columnKey: string) => React.ReactNode;
  onRowAction?: (item: any, actionType: 'history' | 'delete') => void;
  isLoading?: boolean;
}

export const OperationalGrid: React.FC<OperationalGridProps> = ({
  title,
  subtitle,
  columns,
  data,
  onSearch,
  filterCategories = [],
  onFilterChange,
  renderCell,
  onRowAction,
  isLoading = false
}) => {
  const { isDaylight } = useTheme();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string[]>>({});
  const [filterSearch, setFilterSearch] = React.useState('');

  const toggleFilter = (categoryId: string, value: string) => {
    const current = selectedFilters[categoryId] || [];
    const updated = current.includes(value) 
      ? current.filter(v => v !== value)
      : [...current, value];
    
    const newFilters = { ...selectedFilters, [categoryId]: updated };
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    setSelectedFilters({});
    onFilterChange?.({});
  };

  const totalActiveFilters = Object.values(selectedFilters).flat().length;

  return (
    <div className={`rounded-[40px] border transition-all duration-500 overflow-hidden flex flex-col ${
      isDaylight 
        ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50' 
        : 'bg-[#0B0F19] border-white/5 shadow-2xl'
    }`}>
      {/* Cinematic Header Container */}
      <div className={`p-10 pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-8 z-20 ${
        isDaylight ? 'bg-slate-50/50' : 'bg-white/[0.01]'
      }`}>
        <div className="space-y-3">
          {title && (
            <h2 className={`text-3xl font-black uppercase tracking-tighter leading-none ${
              isDaylight ? 'text-slate-900' : 'text-white'
            }`}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="relative group max-w-md w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 transition-colors group-focus-within:text-[#00F0FF]" />
            <input 
              type="text"
              placeholder="Search archived artifacts..."
              onChange={(e) => onSearch?.(e.target.value)}
              className={`w-full lg:w-96 py-4.5 pl-14 pr-6 rounded-2xl border outline-none text-[11px] font-black uppercase tracking-widest transition-all ${
                isDaylight 
                  ? 'bg-white border-slate-200 text-slate-900 focus:border-slate-900' 
                  : 'bg-black/60 border-white/10 text-white focus:border-[#00F0FF]/50 focus:ring-4 focus:ring-[#00F0FF]/5'
              }`}
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-3 px-8 py-4.5 rounded-2xl border font-black uppercase tracking-[0.2em] text-[10px] transition-all shrink-0 relative ${
                isFilterOpen
                  ? (isDaylight ? 'bg-slate-900 border-slate-900 text-white' : 'bg-[#00F0FF] border-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]')
                  : (isDaylight 
                      ? 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20')
              }`}
            >
              <Filter className="w-4.5 h-4.5" />
              Filter
              {totalActiveFilters > 0 && (
                <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border-2 ${
                  isDaylight ? 'bg-slate-900 text-white border-white' : 'bg-[#FF5733] text-white border-[#0B0F19]'
                }`}>
                  {totalActiveFilters}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <div key="filter-layer" className="fixed inset-0 z-10">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0" 
                    onClick={() => setIsFilterOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-10 top-24 w-80 rounded-3xl border shadow-2xl z-20 overflow-hidden ${
                      isDaylight ? 'bg-white border-slate-200' : 'bg-[#151B28] border-white/10'
                    }`}
                  >
                    {/* Filter Search */}
                    <div className={`p-4 border-b ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input 
                          type="text"
                          placeholder="Search filters..."
                          value={filterSearch}
                          onChange={(e) => setFilterSearch(e.target.value)}
                          className={`w-full py-2.5 pl-10 pr-4 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none transition-all ${
                            isDaylight ? 'bg-slate-50 focus:bg-white border-slate-100' : 'bg-black/40 focus:bg-black/60 border-white/5'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Filter Options */}
                    <div className="max-h-96 overflow-y-auto custom-scrollbar p-2">
                      {filterCategories.map((category) => {
                        const filteredOptions = category.options.filter(opt => 
                          opt.label.toLowerCase().includes(filterSearch.toLowerCase())
                        );

                        if (filteredOptions.length === 0) return null;

                        return (
                          <div key={category.id} className="mb-4 last:mb-0">
                            <div className="px-4 py-2">
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">
                                {category.label}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {filteredOptions.map((option) => {
                                const isSelected = selectedFilters[category.id]?.includes(option.value);
                                return (
                                  <button
                                    key={option.value}
                                    onClick={() => toggleFilter(category.id, option.value)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                                      isSelected 
                                        ? (isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF]/10 text-[#00F0FF]')
                                        : (isDaylight ? 'hover:bg-slate-50 text-slate-600' : 'hover:bg-white/5 text-slate-400')
                                    }`}
                                  >
                                    <span className="text-[11px] font-bold tracking-tight">
                                      {option.label}
                                    </span>
                                    {isSelected && <Check className="w-4 h-4" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Filter Footer */}
                    <div className={`p-4 border-t flex items-center justify-between gap-4 ${
                      isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-black/40 border-white/5'
                    }`}>
                      <button 
                        onClick={clearFilters}
                        className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        Reset All
                      </button>
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                          isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black'
                        }`}
                      >
                        Apply
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="flex-1 overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`border-b ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
              {columns.map((col) => (
                <th 
                  key={col.key}
                  className={`px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-${col.align || 'left'} whitespace-nowrap`}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDaylight ? 'divide-slate-50' : 'divide-white/[0.02]'}`}>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-20 text-center">
                  <div className="w-10 h-10 border-4 border-[#00F0FF]/20 border-t-[#00F0FF] rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-20 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No matching artifacts identified</p>
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <motion.tr 
                  key={item.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, ease: "easeOut" }}
                  className={`group transition-all duration-300 ${
                    isDaylight 
                      ? 'hover:bg-slate-50/80' 
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  {columns.map((col) => (
                    <td 
                      key={`${item.id}-${col.key}`}
                      className={`px-10 py-10 text-${col.align || 'left'}`}
                    >
                      {renderCell ? renderCell(item, col.key) : (
                        <span className={`text-[12px] font-medium tracking-tight ${isDaylight ? 'text-slate-800' : 'text-slate-200'}`}>
                          {item[col.key]}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-10 py-10">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onRowAction?.(item, 'history')}
                        className={`p-2.5 rounded-xl transition-all ${
                          isDaylight 
                            ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' 
                            : 'text-slate-500 hover:text-[#00F0FF] hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                        }`}
                      >
                        <History className="w-4.5 h-4.5" />
                      </button>
                      <button 
                        onClick={() => onRowAction?.(item, 'delete')}
                        className={`p-2.5 rounded-xl transition-all ${
                          isDaylight 
                            ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' 
                            : 'text-slate-500 hover:text-[#FF5733] hover:bg-[#FF5733]/10'
                        }`}
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Grid Footer Intelligence */}
      <div className={`p-10 border-t flex flex-col sm:flex-row items-center justify-between gap-6 ${
        isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-black/20 border-white/5'
      }`}>
        <p className={`text-[10px] font-black uppercase tracking-widest italic leading-none ${
          isDaylight ? 'text-slate-400' : 'text-slate-600'
        }`}>
          "Operational artifacts are synchronized across multi-tenant architecture."
        </p>
        <div className="flex items-center gap-4">
           <div className={`px-4 py-2 rounded-xl border flex items-center gap-3 transition-colors ${
             isDaylight ? 'bg-white border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-slate-500'
           }`}>
             <Database className="w-3.5 h-3.5" />
             <span className="text-[9px] font-black uppercase tracking-[0.2em]">Metadata Integrity Locked</span>
           </div>
        </div>
      </div>
    </div>
  );
};
