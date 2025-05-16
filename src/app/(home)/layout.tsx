'use client';

import { useDisclosure } from '@mantine/hooks';
import { AppShell } from '@mantine/core';
import Header from '@/components/mantine/appshell/Header';
import Navbar from '@/components/mantine/appshell/Navbar';

export default function PetLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 200,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: opened },
      }}
      padding="md"
    >
      <Header toggle={toggle} opened={opened} />
      <Navbar />

      <AppShell.Main>
        {children}
      </AppShell.Main>

      <AppShell.Footer zIndex={opened ? 'auto' : 201} className="flex items-center justify-center" >
        KRAHL DEVS ALL RIGHTS RESERVED
      </AppShell.Footer>
    </AppShell>
  );
}