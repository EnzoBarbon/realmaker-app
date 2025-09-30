import { useResponsive } from '@/hooks/useResponsive';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export interface Column<T> {
  key: string;
  header: string;
  width?: number | string;
  minWidth?: number;
  render?: (item: T) => React.ReactNode;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowPress?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowPress,
  emptyMessage = 'No hay datos disponibles',
}: DataTableProps<T>) {
  const { isCompact } = useResponsive();

  // Filter columns based on mobile visibility
  const visibleColumns = isCompact ? columns.filter((col) => !col.hideOnMobile) : columns;

  if (data.length === 0) {
    return (
      <View className="py-12 items-center justify-center">
        <Text className="text-sm text-gray-500">{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View className="w-full">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: '100%' }}>
          {/* Header */}
          <View className="flex-row border-b border-gray-200 bg-gray-50 px-4 py-3">
            {visibleColumns.map((column) => (
              <View
                key={column.key}
                style={{
                  width: column.width,
                  minWidth: column.minWidth,
                  flex: column.width ? undefined : 1,
                }}
                className="px-2"
              >
                <Text className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  {column.header}
                </Text>
              </View>
            ))}
          </View>

          {/* Rows */}
          {data.map((item, index) => {
            const RowWrapper = onRowPress ? Pressable : View;
            const rowProps = onRowPress
              ? {
                  onPress: () => onRowPress(item),
                  className: `flex-row border-b border-gray-100 px-4 py-3 hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`,
                }
              : {
                  className: `flex-row border-b border-gray-100 px-4 py-3 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`,
                };

            return (
              <RowWrapper key={keyExtractor(item)} {...rowProps}>
                {visibleColumns.map((column) => (
                  <View
                    key={column.key}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth,
                      flex: column.width ? undefined : 1,
                    }}
                    className="px-2 justify-center"
                  >
                    {column.render ? (
                      column.render(item)
                    ) : (
                      <Text className="text-sm text-gray-900">{(item as any)[column.key]}</Text>
                    )}
                  </View>
                ))}
              </RowWrapper>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
