'use client';

import { AppShell, NavLink } from '@mantine/core';
import Link from 'next/link';
import {
  IconHome,
  IconPaw,
  IconUser,
  IconCalendar
} from '@tabler/icons-react';

export default function Navbar() {
  return (
    <AppShell.Navbar p="md">
      <NavLink
        component={Link}
        href="/"
        label="Home"
        mb={5}
        leftSection={<IconHome size="1rem" />}
      />

      <NavLink
        component={Link}
        href="/pet"
        label="Pets"
        mb={5}
        leftSection={<IconPaw size="1rem" />}
      />

      <NavLink
        component={Link}
        href="/customers"
        label="Clientes"
        mb={5}
        leftSection={<IconUser size="1rem" />}
      />

      <NavLink
        component={Link}
        href="/users"
        label="Usuários"
        mb={5}
        leftSection={<IconUser size="1rem" />}
      />

      <NavLink
        component={Link}
        href="/schedule"
        label="Agendamentos"
        mb={5}
        leftSection={<IconCalendar size="1rem" />}
      />
    </AppShell.Navbar>
  );
}