"use client";

import { Box, Button, Group, Title } from "@mantine/core";
import {
  MantineReactTable,
  MRT_RowData,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";

interface GenericTableProps<T extends MRT_RowData> {
  title: string;
  columns: MRT_ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  onAddClick?: () => void;
  onDeleteSelected?: (selectedRow: T) => void;
  onEditClick?: (selectedRow: T) => void;
}

export function GenericTable<T extends MRT_RowData & { id: number }>({
  title,
  columns,
  data,
  isLoading = false,
  onAddClick,
  onDeleteSelected,
  onEditClick,
}: GenericTableProps<T>) {

  const table = useMantineReactTable({
    columns,
    data: data,
    enablePagination: true,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSelectAll: false,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: { cursor: 'pointer' },
    }),
    mantineTableProps: {
      striped: true,
      withTableBorder: true,
    },
    initialState: {
      columnVisibility: {
        'mrt-row-select': false,
      },
    },
    state: {
      isLoading: isLoading,
    },
    renderTopToolbarCustomActions: ({ table }) => {
      const selectedRow = table.getSelectedRowModel().rows[0];
      return (
        <Group gap="sm">
          {onAddClick && <Button onClick={onAddClick}>Novo</Button>}

          {onEditClick && (
            <Button
              onClick={() => selectedRow && onEditClick(selectedRow.original)}
              disabled={!selectedRow}
              color="blue"
            >
              Editar
            </Button>
          )}

          {onDeleteSelected && (
            <Button
              onClick={() => selectedRow && onDeleteSelected(selectedRow.original)}
              disabled={!selectedRow}
              color="red"
            >
              Deletar
            </Button>
          )}
        </Group>
      );
    },
  });

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Title order={3}>{title}</Title>
      </Group>

      <MantineReactTable table={table} />
    </Box>
  );
}