import { MRT_ColumnDef } from 'mantine-react-table';
import { customerData } from '@/types/Customer';
import { formatPhoneNumber } from '@/lib/utils';

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
    Cell: ({ cell }) => formatPhoneNumber(cell.getValue<string>()),
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