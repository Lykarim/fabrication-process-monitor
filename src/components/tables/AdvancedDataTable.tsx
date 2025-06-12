
import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, Download, Search, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ColumnConfig {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'status' | 'custom';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface AdvancedDataTableProps {
  data: any[];
  columns: ColumnConfig[];
  title: string;
  enableSearch?: boolean;
  enableFilters?: boolean;
  enableExport?: boolean;
  pageSize?: number;
  actions?: (row: any) => React.ReactNode;
}

export function AdvancedDataTable({
  data,
  columns,
  title,
  enableSearch = true,
  enableFilters = true,
  enableExport = true,
  pageSize = 10,
  actions
}: AdvancedDataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [dateFilters, setDateFilters] = useState<Record<string, { start?: Date; end?: Date }>>({});

  // Données filtrées et triées
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Recherche globale
    if (searchTerm) {
      filtered = filtered.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Filtres par colonnes
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(row => {
          const rowValue = row[key];
          if (Array.isArray(value)) {
            return value.includes(rowValue);
          }
          return rowValue === value;
        });
      }
    });

    // Filtres par dates
    Object.entries(dateFilters).forEach(([key, dateRange]) => {
      if (dateRange.start || dateRange.end) {
        filtered = filtered.filter(row => {
          const rowDate = new Date(row[key]);
          if (dateRange.start && rowDate < dateRange.start) return false;
          if (dateRange.end && rowDate > dateRange.end) return false;
          return true;
        });
      }
    });

    // Tri
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === bValue) return 0;
        
        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [data, searchTerm, filters, dateFilters, sortConfig, columns]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Gestion du tri
  const handleSort = (key: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig?.key === key) {
        if (prevConfig.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prevConfig.direction === 'desc') {
          return null;
        }
      }
      return { key, direction: 'asc' };
    });
  };

  // Gestion des filtres
  const handleFilterChange = (columnKey: string, value: any) => {
    setFilters(prev => ({ ...prev, [columnKey]: value }));
    setCurrentPage(1);
  };

  const handleDateFilterChange = (columnKey: string, type: 'start' | 'end', date: Date | undefined) => {
    setDateFilters(prev => ({
      ...prev,
      [columnKey]: {
        ...prev[columnKey],
        [type]: date
      }
    }));
    setCurrentPage(1);
  };

  // Export CSV
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [
          columns.map(col => col.label).join(","),
          ...processedData.map(row => 
            columns.map(col => row[col.key] || '').join(",")
          )
        ].join("\n");
    
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Obtenir les valeurs uniques pour les filtres
  const getUniqueValues = (columnKey: string) => {
    return [...new Set(data.map(row => row[columnKey]).filter(Boolean))];
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({});
    setDateFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            {enableFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            )}
            {enableExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={processedData.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Barre de recherche */}
        {enableSearch && (
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        )}

        {/* Panel de filtres */}
        {showFilters && enableFilters && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Filtres avancés</h4>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Réinitialiser
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {columns.filter(col => col.filterable).map(column => (
                <div key={column.key}>
                  <Label className="text-sm font-medium">{column.label}</Label>
                  
                  {column.type === 'date' ? (
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {dateFilters[column.key]?.start 
                              ? format(dateFilters[column.key].start!, 'dd/MM', { locale: fr })
                              : 'Début'
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateFilters[column.key]?.start}
                            onSelect={(date) => handleDateFilterChange(column.key, 'start', date)}
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {dateFilters[column.key]?.end 
                              ? format(dateFilters[column.key].end!, 'dd/MM', { locale: fr })
                              : 'Fin'
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateFilters[column.key]?.end}
                            onSelect={(date) => handleDateFilterChange(column.key, 'end', date)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  ) : column.type === 'status' ? (
                    <div className="space-y-2">
                      {getUniqueValues(column.key).map(value => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${column.key}-${value}`}
                            checked={(filters[column.key] || []).includes(value)}
                            onCheckedChange={(checked) => {
                              const currentFilter = filters[column.key] || [];
                              if (checked) {
                                handleFilterChange(column.key, [...currentFilter, value]);
                              } else {
                                handleFilterChange(column.key, currentFilter.filter((v: any) => v !== value));
                              }
                            }}
                          />
                          <Label htmlFor={`${column.key}-${value}`} className="text-sm">
                            {value}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Select
                      value={filters[column.key] || 'all'}
                      onValueChange={(value) => handleFilterChange(column.key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        {getUniqueValues(column.key).map(value => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Résumé des résultats */}
        <div className="text-sm text-gray-600">
          {processedData.length} résultat(s) sur {data.length} total
          {Object.keys(filters).length > 0 || searchTerm ? ' (filtré)' : ''}
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead 
                  key={column.key}
                  className={column.sortable ? "cursor-pointer" : ""}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <div className="flex flex-col">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : (
                            <ArrowDown className="w-4 h-4" />
                          )
                        ) : (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                {columns.map(column => (
                  <TableCell key={column.key}>
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : column.type === 'date' ? (
                      row[column.key] ? format(new Date(row[column.key]), 'dd/MM/yyyy HH:mm', { locale: fr }) : '-'
                    ) : column.type === 'status' ? (
                      <Badge variant={row[column.key] === 'normal' ? 'default' : 'destructive'}>
                        {row[column.key]}
                      </Badge>
                    ) : (
                      row[column.key] || '-'
                    )}
                  </TableCell>
                ))}
                {actions && <TableCell>{actions(row)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
