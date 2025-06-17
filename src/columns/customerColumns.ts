import { MRT_ColumnDef } from 'mantine-react-table';
import { customerData } from '@/types/Customer';

export const customerColumns: MRT_ColumnDef<customerData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'address',
    header: 'Endereço',
  },
];