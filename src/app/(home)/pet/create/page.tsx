"use client"

import { Button, Group, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { petSchema, PetFormData } from '@/types/Pet';
import { notifications } from '@mantine/notifications';
import { PetService } from "@/services/PetService";
import { CustomerService } from "@/services/CustomerService";
import { useMutation, useQuery } from '@tanstack/react-query';
import { sessionStore } from '@/store/session-store';

export default function PetForm() {
  const user = sessionStore(state => state.user);

  const form = useForm<PetFormData>({
    mode: 'uncontrolled',
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

  const { data: customerOptions = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => new CustomerService().getSelectOptions(),
  });

  const mutation = useMutation({
    mutationFn: (values: PetFormData) => new PetService().insert(values),
    onSuccess: () => {
      notifications.show({
        title: 'Sucesso!',
        message: 'Pet cadastrado com sucesso',
        color: 'green',
      });
      // form.reset();
    },
    onError: () => {
      notifications.show({
        title: 'Erro',
        message: 'Falha ao cadastrar pet',
        color: 'red',
      });
    }
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
    mutation.mutate(values);
  };

  const handleReset = () => {
    form.reset();
    form.clearErrors();
    console.log("user zustand " + user?.email as string);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} onReset={handleReset}>
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
        <Button type="submit" loading={mutation.isPending}>
          {mutation.isPending ? 'Enviando...' : 'Enviar'}
        </Button>
        <Button type="reset">Limpar</Button>
      </Group>
    </form>
  );
}