"use client";

import { petColumns } from "@/columns/petColumns";
import { PetService } from "@/services/PetService";
import { petSchemaData, PetData } from "@/types/Pet"; 
import { GenericTable } from "@/components/mantine/reacttable/GenericTable"; 
import { PetModal } from "@/components/mantine/reacttable/PetModal";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { modals } from '@mantine/modals'; 

export default function Page() {
  const petService = new PetService();
  const queryClient = useQueryClient();

  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<PetData | null>(null);

  const { data: pets, isLoading } = useQuery<PetData[]>({
    queryKey: ["pets"],
    queryFn: async () => {
      const data = await petService.getAll(petSchemaData.array());
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => petService.delete(id),
    onSuccess: () => {
      notifications.show({
        title: 'Sucesso',
        message: 'Pet deletado com sucesso!',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
    onError: (error: any) => {
      console.error("Erro ao deletar pet:", error);
      notifications.show({
        title: 'Erro',
        message: `Falha ao deletar pet: ${error.response?.data?.message || error.message || 'Erro desconhecido'}`,
        color: 'red',
      });
    },
  });

  const handleAddClick = () => {
    setPetToEdit(null);
    setAddEditModalOpen(true);
  };

  const handleEditClick = (pet: PetData) => {
    setPetToEdit(pet);
    setAddEditModalOpen(true);
  };

  const handleDeletePet = (petToDelete: PetData) => {
    modals.openConfirmModal({
      title: 'Confirmação de Exclusão',
      centered: true,
      children: (
        <p>
          Tem certeza que deseja deletar o pet <strong>“{petToDelete.name}”</strong>?
          Esta ação não pode ser desfeita.
        </p>
      ),
      labels: { confirm: 'Deletar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onCancel: () => notifications.show({
        title: 'Cancelado',
        message: 'Exclusão de pet cancelada.',
        color: 'gray',
      }),
      onConfirm: () => deleteMutation.mutate(petToDelete.id),
    });
  };

  const handleModalSuccess = () => {
    setAddEditModalOpen(false);
    setPetToEdit(null);
    queryClient.invalidateQueries({ queryKey: ["pets"] });
  };

  return (
    <>
      <GenericTable<PetData>
        title="Pets"
        columns={petColumns}
        data={pets ?? []} 
        isLoading={isLoading} 
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteSelected={handleDeletePet} 
      />

      <PetModal
        opened={addEditModalOpen}
        onClose={() => {
          setAddEditModalOpen(false);
          setPetToEdit(null); 
        }}
        onSuccess={handleModalSuccess}
        petToEdit={petToEdit} 
      />
    </>
  );
}