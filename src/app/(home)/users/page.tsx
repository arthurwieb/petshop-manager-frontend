"use client";

import { GenericTable } from "@/components/mantine/reacttable/GenericTable";
import { UserService } from "@/services/UserService";
import { userDataSchema, userData } from "@/types/User";
import { userColumns } from "@/columns/userColumns";

export default function Page() {
  return (
    <GenericTable<userData>
      title="Usuarios"
      columns={userColumns}
      queryFn={() => new UserService().getAll(userDataSchema.array())}
    />
  );
}