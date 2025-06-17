"use client";

import { Box, Button, Group, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  MantineReactTable,
  MRT_RowData,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useState } from "react";

interface GenericTableProps<T extends MRT_RowData & { id: number }> {
  title: string;
  columns: MRT_ColumnDef<T>[];
  queryFn: () => Promise<T[]>;
  formComponent?: React.FC<{
    opened: boolean;
    onClose: () => void;
    onSuccess?: () => void;
  }>;
}

export function GenericTable<T extends MRT_RowData & { id: number }>({
  title,
  columns,
  queryFn,
  formComponent: FormComponent,
}: GenericTableProps<T>) {
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery<T[]>({
    queryKey: [title.toLowerCase()],
    queryFn,
  });

  const table = useMantineReactTable({
    columns,
    data: data ?? [],
    enableColumnResizing: true,
    enableRowSelection: false,
    enableFullScreenToggle: true,
    mantineTableProps: {
      striped: true,
      withTableBorder: true,
    },
    state: {
      isLoading,
    },
    renderTopToolbarCustomActions: () => (
      <Button onClick={() => setModalOpen(true)}>Novo</Button>
    ),
  });

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Title order={3}>{title}</Title>
      </Group>

      <MantineReactTable table={table} />

      {FormComponent && (
        <FormComponent
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            refetch();
            setModalOpen(false);
          }}
        />
      )}
    </Box>
  );
}
