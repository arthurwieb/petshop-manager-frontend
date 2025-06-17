"use client";

import { customerColumns } from "@/columns/customerColumns";
import { CustomerService } from "@/services/CustomerService";
import { customerDataSchema, customerData } from "@/types/Customer";
import { GenericTable } from "@/components/mantine/reacttable/GenericTable";
import { CustomerModal } from "@/components/mantine/reacttable/CustomerModal";

export default function Page() {
  return (
    <GenericTable<customerData>
      title="Clientes"
      columns={customerColumns}
      queryFn={() => new CustomerService().getAll(customerDataSchema.array())}
      formComponent={CustomerModal}
    />
  );
}