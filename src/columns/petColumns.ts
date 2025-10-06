import { MRT_ColumnDef } from 'mantine-react-table';
import { PetData } from '@/types/Pet';
import { customerData } from '@/types/Customer';

export const getPetColumns = (customers: customerData[]): MRT_ColumnDef<PetData>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'customer_id',
    header: 'Tutor',
    Cell: ({ cell }) => {
      const customerId = cell.getValue<number>();
      const customer = customers.find(c => c.id === customerId);
      return customer ? customer.name : 'N/A';
    },
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