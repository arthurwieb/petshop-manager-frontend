"use client";

import { useState } from 'react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { useQuery } from '@tanstack/react-query';
import { CustomerService } from '@/services/CustomerService';
import { MRT_ColumnDef } from 'mantine-react-table';
import { Button } from '@mantine/core';
import { customerData } from '@/types/Customer';
import { CustomerModal } from './CustomerModal';

export function CustomerTable() {
  const [modalOpened, setModalOpened] = useState(false);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await new CustomerService().getAll();
      return response.data;
    },
  });

  const columns: MRT_ColumnDef<customerData>[] = [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'phone', header: 'Telefone' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'address', header: 'Endereço' },
  ];

  const table = useMantineReactTable({
    columns,
    data: customers,
    state: { isLoading },
    renderTopToolbarCustomActions: () => (
      <Button onClick={() => setModalOpened(true)}>Novo Cliente</Button>
    ),
  });

  return (
    <>
      <MantineReactTable table={table} />
      <CustomerModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </>
  );
}
