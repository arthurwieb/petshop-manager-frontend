import { Flex, Burger, Button, useMantineColorScheme, useComputedColorScheme, AppShell } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

interface HeaderProps {
  toggle: () => void;
  opened: boolean;
}

const Header = ({ toggle, opened }: HeaderProps) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppShell.Header>
      <Flex justify="space-between" align="center" style={{ padding: '10px 20px' }}>
        <Burger opened={opened} onClick={toggle} size="sm"  />
        <div>PET SHOP MANAGER</div>
        
        <Button size="sm" variant="link" onClick={toggleColorScheme}>
          {computedColorScheme === 'dark' ? <IconSun /> : <IconMoon />}
        </Button>
      </Flex>
    </AppShell.Header>
  );
};

export default Header;