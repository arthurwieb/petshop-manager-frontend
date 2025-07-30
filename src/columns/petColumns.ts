import { MRT_ColumnDef } from 'mantine-react-table';
import { PetData } from '@/types/Pet';

export const petColumns: MRT_ColumnDef<PetData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'customer_id',
    header: 'Tutor',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'species',
    header: 'Espécie',
  },
  {
    accessorKey: 'breed',
    header: 'Raça',
  },
  {
    accessorKey: 'age',
    header: 'Idade',
  },
  
  {
    accessorKey: 'notes',
    header: 'Observações',
  },
];