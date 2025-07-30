"use client";

import { Modal, Button, Group, Textarea, TextInput, NumberInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { CustomerService } from "@/services/CustomerService";
import { sessionStore } from "@/store/session-store";
import { petSchema, PetFormData, PetData } from "@/types/Pet";
import { PetService } from "@/services/PetService";
import { useEffect } from "react";

interface PetModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: (isUpdate: boolean) => void;
  petToEdit: PetData | null;
}

export function PetModal({ opened, onClose, onSuccess, petToEdit }: PetModalProps) {
  const user = sessionStore((state) => state.user);
  const queryClient = useQueryClient();

  const form = useForm<PetFormData>({
    initialValues: {
      name: '',
      species: '',
      breed: '',
      age: undefined,
      company_id: user?.company_id as number,
      customer_id: 1,
      notes: ''
    },
    validate: zodResolver(petSchema),
    validateInputOnChange: true,
  });


  useEffect(() => {
    if (petToEdit) {
      form.setValues({
        name: petToEdit.name,
        species: petToEdit.species || "",
        breed: petToEdit.breed || "",
        age: petToEdit.age || undefined,
        company_id: petToEdit.company_id,
        notes: petToEdit.notes || ""
      });
    } else {
      form.reset();
      form.setFieldValue("company_id", user?.company_id ?? 0);
    }
  }, [petToEdit, opened, user]);


  const { data: customerOptions = [] } = useQuery({
    queryKey: ['customers-list'],
    queryFn: () => new CustomerService().getSelectOptions(),
  });

  const createMutation = useMutation({
    mutationFn: (values: PetFormData) => new PetService().insert(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      notifications.show({
        title: "Sucesso!",
        message: "Pet cadastrado com sucesso",
        color: "green",
      });
      onClose();
      onSuccess(false);
    },
    onError: (error: any) => {
      console.error("Erro ao cadastrar pet:", error);
      notifications.show({
        title: "Erro",
        message: `Falha ao cadastrar Pet: ${error.response?.data?.message || error.message || 'Erro desconhecido'}`,
        color: "red",
      });
    },
  });


  const updateMutation = useMutation({
    mutationFn: (values: PetData) => new PetService().update(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      notifications.show({
        title: "Sucesso!",
        message: "Pet atualizado com sucesso",
        color: "green",
      });
      onClose();
      onSuccess(true);
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar pet:", error);
      notifications.show({
        title: "Erro",
        message: `Falha ao atualizar pet: ${error.response?.data?.message || error.message || 'Erro desconhecido'}`,
        color: "red",
      });
    },
  });


  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (values: PetFormData) => {
    if (petToEdit) {
      const dataToUpdate: PetData = {
        ...petToEdit,
        ...values,
      };
      updateMutation.mutate(dataToUpdate);
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={petToEdit ? "Editar Pet" : "Cadastrar Pet"}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Nome"
          placeholder="Nome do pet"
          key={form.key('name')}
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Espécie"
          placeholder="Cachorro, gato, lhama, vaca, cavalo ...."
          key={form.key('species')}
          {...form.getInputProps('species')}
        />

        <TextInput
          label="Raça"
          placeholder="Pinscher, vira lata, poodle...."
          key={form.key('breed')}
          {...form.getInputProps('breed')}
        />

        <NumberInput
          label="Idade"
          hideControls
          placeholder="Idade do bicho"
          key={form.key('age')}
          {...form.getInputProps('age')}
        />

        <Select
          label="Tutor"
          placeholder="Cliente responsável pelo animal"
          data={customerOptions}
          searchable
          clearable
          key={form.key('customer_id')}
          nothingFoundMessage="Nothing found..."
          {...form.getInputProps('customer_id')}
        />

        <Textarea
          label="Observações"
          placeholder="Ex: Cachorro bravo, alérgico a remédios, problema na pata traseira..."
          autosize
          minRows={2}
          maxRows={4}
          key={form.key('notes')}
          {...form.getInputProps('notes')}
        />

        <input type="hidden" {...form.getInputProps('company_id')} />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? "Enviando..." : (petToEdit ? "Atualizar" : "Salvar")}
          </Button>
          <Button type="button" onClick={form.reset}>
            Limpar
          </Button>
        </Group>
      </form>
    </Modal>
  );
}