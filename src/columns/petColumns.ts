import { MRT_ColumnDef } from 'mantine-react-table';
import { PetFormData } from '@/types/Pet';

export const petColumns: MRT_ColumnDef<PetFormData>[] = [
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
    accessorKey: 'Idade',
    header: 'age',
  },
  {
    accessorKey: 'customer_id',
    header: 'Tutor',
  },
];