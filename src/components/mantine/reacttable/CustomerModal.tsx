"use client";

import { Modal, Button, Group, Textarea, TextInput } from "@mantine/core";
import { PhoneInput } from "@/components/mantine/inputs/phone-input";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { CustomerService } from "@/services/CustomerService";
import { sessionStore } from "@/store/session-store";
import { customerSchema, customerForm, customerData } from "@/types/Customer";
import { useEffect } from "react";

interface CustomerModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: (isUpdate: boolean) => void;
  customerToEdit: customerData | null;
}

export function CustomerModal({ opened, onClose, onSuccess, customerToEdit }: CustomerModalProps) {
  const user = sessionStore((state) => state.user);
  const queryClient = useQueryClient();

  const form = useForm<customerForm>({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      company_id: user?.company_id ?? 0,
    },
    validate: zodResolver(customerSchema),
    validateInputOnChange: true,
  });

  useEffect(() => {
    if (customerToEdit) {
      form.setValues({
        name: customerToEdit.name,
        phone: customerToEdit.phone || "",
        email: customerToEdit.email || "",
        address: customerToEdit.address || "",
        company_id: customerToEdit.company_id,
      });
    } else {
      form.reset();
      form.setFieldValue("company_id", user?.company_id ?? 0);
    }
  }, [customerToEdit, opened, user]);

  const createMutation = useMutation({
    mutationFn: (values: customerForm) => new CustomerService().insert(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers-list"] });
      
      onClose();
      onSuccess(false);
    },
    onError: (error: any) => {
      console.error("Erro ao cadastrar cliente:", error);
      notifications.show({
        title: "Erro",
        message: `Falha ao cadastrar cliente: ${error.response?.data?.message || error.message || 'Erro desconhecido'}`,
        color: "red",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: customerData) => new CustomerService().update(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers-list"] });
      onClose();
      onSuccess(true); 
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar cliente:", error);
      notifications.show({
        title: "Erro",
        message: `Falha ao atualizar cliente: ${error.response?.data?.message || error.message || 'Erro desconhecido'}`,
        color: "red",
      });
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (values: customerForm) => {
    if (customerToEdit) {
      // It's an UPDATE operation
      const dataToUpdate: customerData = {
        ...customerToEdit, 
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
      title={customerToEdit ? "Editar Cliente" : "Cadastrar Cliente"}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Nome"
          placeholder="Nome do cliente"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />

        <PhoneInput
          label="Telefone"
          placeholder="Telefone ...."
          initialCountryCode="BR"
          key={form.key("phone")}
          {...form.getInputProps("phone")}
        />

        <TextInput
          label="Email"
          placeholder="fulano@gmail.com"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />

        <Textarea
          label="Endereço"
          placeholder="Ex: Rua Tchudosbangos..."
          autosize
          minRows={2}
          maxRows={4}
          key={form.key("address")}
          {...form.getInputProps("address")}
        />

        <input type="hidden" {...form.getInputProps("company_id")} />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? "Enviando..." : (customerToEdit ? "Atualizar" : "Salvar")}
          </Button>
          {/* You might want to remove this "Limpar" button or adjust its behavior when editing */}
          <Button type="button" onClick={form.reset}>
             Limpar
           </Button>
        </Group>
      </form>
    </Modal>
  );
}