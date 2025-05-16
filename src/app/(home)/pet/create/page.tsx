"use client"

import { Button, Group, NumberInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { petSchema, PetFormData } from '@/types/Pet';
import { notifications } from '@mantine/notifications';
import { PetService } from "@/services/PetService";
import { useMutation } from '@tanstack/react-query';


export default function PetForm() {
  const form = useForm<PetFormData>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      species: '',
      breed: '',
      age: undefined,
      company_id: 1, //futuramente isso vai pegar automático de acordo com qual companhia estamos logados, exemplo petshop do ander = company 1
      customer_id: 1, //temos que fazer um selector que identifica os clientes cadastrados, de preferência com um autocomplete

    },
    validate: zodResolver(petSchema),
    validateInputOnChange: true,
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
        placeholder="Idade do bicho"
        key={form.key('age')}
        {...form.getInputProps('age')}
      />

      <input type="hidden" {...form.getInputProps('company_id')} />
      <input type="hidden" {...form.getInputProps('customer_id')} />

      <Group justify="flex-end" mt="md">
        <Button type="submit" loading={mutation.isPending}>
          {mutation.isPending ? 'Enviando...' : 'Enviar'}
        </Button>
        <Button type="reset">Limpar</Button>
      </Group>
    </form>
  );
}