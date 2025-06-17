"use client"

import { PhoneInput } from "@/components/mantine/inputs/phone-input";
import { CustomerService } from "@/services/CustomerService";
import { sessionStore } from '@/store/session-store';
import { customerSchema, customerForm } from '@/types/Customer';
import { Button, Group, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from 'mantine-form-zod-resolver';

export default function CustomerForm() {
  const user = sessionStore(state => state.user);

  const form = useForm<customerForm>({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      company_id: user?.company_id as number,
    },
    validate: zodResolver(customerSchema),
    validateInputOnChange: true,
  });

  const mutation = useMutation({
    mutationFn: (values: customerForm) => new CustomerService().insert(values),
    onSuccess: () => {
      notifications.show({
        title: 'Sucesso!',
        message: 'Cliente cadastrado com sucesso',
        color: 'green',
      });
      // form.reset();
    },
    onError: () => {
      notifications.show({
        title: 'Erro',
        message: 'Falha ao cadastrar cliente',
        color: 'red',
      });
    }
  });

  const handleSubmit = (values: typeof form.values) => {
    try {
      console.log(values);
      mutation.mutate(values);
    } catch (error) {
      console.error("Submission failed:", error); // Simple error logging
    }
  };

  const handleReset = () => {
    console.log("Current form values before reset:", form.getValues());
    // form.reset();
    //form.clearErrors();
    console.log("user zustand " + user?.email as string);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} onReset={handleReset}>
      <TextInput
        label="Nome"
        placeholder="Nome do cliente"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />

      <PhoneInput
        label="Telefone"
        placeholder="Telefone ...."
        initialCountryCode="BR"
        key={form.key('phone')}
        {...form.getInputProps('phone')}
      />

      <TextInput
        label="Email"
        placeholder="fulano@gmail.com"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />
      <Textarea
        label="Endereço"
        placeholder="Ex: Rua Tchudosbangos..."
        autosize
        minRows={2}
        maxRows={4}
        key={form.key('address')}
        {...form.getInputProps('address')}
      />

      <input type="hidden" {...form.getInputProps('company_id')} />

      <Group justify="flex-end" mt="md">
        <Button type="submit" loading={mutation.isPending}>
          {mutation.isPending ? 'Enviando...' : 'Enviar'}
        </Button>
        <Button type="reset">Limpar</Button>
      </Group>
    </form>
  );
}