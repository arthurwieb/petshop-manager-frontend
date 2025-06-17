"use client";

import { Modal, Button, Group, Textarea, TextInput } from "@mantine/core";
import { PhoneInput } from "@/components/mantine/inputs/phone-input";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { CustomerService } from "@/services/CustomerService";
import { sessionStore } from "@/store/session-store";
import { customerSchema, customerForm } from "@/types/Customer";

interface CustomerModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CustomerModal({ opened, onClose, onSuccess }: CustomerModalProps) {
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

  const mutation = useMutation({
    mutationFn: (values: customerForm) => new CustomerService().insert(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });

      notifications.show({
        title: "Sucesso!",
        message: "Cliente cadastrado com sucesso",
        color: "green",
      });

      form.reset();
      onClose(); // fecha o modal
      onSuccess?.(); // dispara callback genérico opcional
    },
    onError: () => {
      notifications.show({
        title: "Erro",
        message: "Falha ao cadastrar cliente",
        color: "red",
      });
    },
  });

  const handleSubmit = (values: customerForm) => {
    mutation.mutate(values);
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Cadastrar Cliente" centered>
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
          <Button type="submit" loading={mutation.isPending}>
            {mutation.isPending ? "Enviando..." : "Enviar"}
          </Button>
          <Button type="button" variant="default" onClick={form.reset}>
            Limpar
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
