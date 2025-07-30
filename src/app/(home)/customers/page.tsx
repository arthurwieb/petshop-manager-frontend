"use client";
import { customerColumns } from "@/columns/customerColumns";
import { CustomerService } from "@/services/CustomerService";
import { customerDataSchema, customerData } from "@/types/Customer";
import { GenericTable } from "@/components/mantine/reacttable/GenericTable";
import { CustomerModal } from "@/components/mantine/reacttable/CustomerModal";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { modals } from '@mantine/modals'; 

export default function Page() {
  const customerService = new CustomerService();
  const queryClient = useQueryClient();

  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<customerData | null>(null);

  const { data: customers, isLoading } = useQuery<customerData[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const data = await customerService.getAll(customerDataSchema.array());
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => customerService.delete(id),
    onSuccess: () => {
      notifications.show({
        title: 'Sucesso',
        message: 'Cliente deletado com sucesso!',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: any) => {
      console.error("Erro ao deletar cliente:", error);
      notifications.show({
        title: 'Erro',
        message: `Falha ao deletar cliente: ${error.response?.data?.message || error.message || 'Erro desconhecido'}`,
        color: 'red',
      });
    },
  });

  const handleAddClick = () => {
    setCustomerToEdit(null); 
    setAddEditModalOpen(true); 
  };

  
  const handleEditClick = (customer: customerData) => {
    setCustomerToEdit(customer); 
    setAddEditModalOpen(true); 
  };

  const handleDeleteCustomer = (customerToDelete: customerData) => {
    modals.openConfirmModal({
      title: 'Confirmação de Exclusão',
      centered: true,
      children: (
        <p>
          Tem certeza que deseja deletar o cliente <strong>“{customerToDelete.name}”</strong>?
          Esta ação não pode ser desfeita.
        </p>
      ),
      labels: { confirm: 'Deletar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' }, 
      onCancel: () => notifications.show({
        title: 'Cancelado',
        message: 'Exclusão de cliente cancelada.',
        color: 'gray',
      }),
      onConfirm: () => deleteMutation.mutate(customerToDelete.id), 
    });
  };

  const handleModalSuccess = (isUpdate: boolean) => { 
    setAddEditModalOpen(false); 
    setCustomerToEdit(null); 
    queryClient.invalidateQueries({ queryKey: ["customers"] }); 

    notifications.show({
      title: 'Sucesso',
      message: `Cliente ${isUpdate ? 'atualizado' : 'salvo'} com sucesso!`, 
      color: 'green',
    });
  };

  return (
    <>
      <GenericTable<customerData>
        title="Clientes"
        columns={customerColumns}
        data={customers ?? []}
        isLoading={isLoading}
        onAddClick={handleAddClick} 
        onEditClick={handleEditClick} 
        onDeleteSelected={handleDeleteCustomer}
      />

      <CustomerModal
        opened={addEditModalOpen} 
        onClose={() => {
          setAddEditModalOpen(false);
          setCustomerToEdit(null); 
        }}
        onSuccess={handleModalSuccess}
        customerToEdit={customerToEdit} 
      />
    </>
  );
}