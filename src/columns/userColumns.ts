import { userData } from '@/types/User';
import { MRT_ColumnDef } from 'mantine-react-table';

export const userColumns: MRT_ColumnDef<userData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'username',
    header: 'Usuário',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];