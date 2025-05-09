import { Flex, Burger, ActionIcon, useMantineColorScheme, useComputedColorScheme, AppShell } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

interface HeaderProps {
  toggle: () => void;
  opened: boolean;
}

const Header = ({ toggle, opened }: HeaderProps) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const isDarkMode = computedColorScheme === 'dark';

  return (
    <AppShell.Header>
      <Flex justify="space-between" align="center" style={{ padding: '10px 20px' }}>
        <Burger 
          opened={opened} 
          onClick={toggle} 
          size="sm" 
        />
        <div>PET SHOP MANAGER</div>
          <ActionIcon
            variant="subtle"
            color={isDarkMode ? 'yellow.4' : 'gray.7'}
            onClick={() => setColorScheme(isDarkMode ? 'light' : 'dark')}
            size="lg"
          >
            {isDarkMode ? (
              <IconSun size="1.2rem" />
            ) : (
              <IconMoon size="1.2rem" />
            )}
          </ActionIcon>
      </Flex>
    </AppShell.Header>
  );
};

export default Header;