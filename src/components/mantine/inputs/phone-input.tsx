import { useEffect, useRef, useState } from 'react';
import {
  useCombobox,
  Combobox,
  Group,
  CheckIcon,
  ScrollArea,
  InputBase,
  ActionIcon,
  type InputBaseProps,
  type PolymorphicComponentProps,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import countries from 'i18n-iso-countries';
import br from 'i18n-iso-countries/langs/es.json';
import {
  getExampleNumber,
  type CountryCode,
  parsePhoneNumberFromString,
  getCountries,
  AsYouType,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import { IMaskInput } from 'react-imask';

countries.registerLocale(br);

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const libIsoCountries = countries.getNames('es', { select: 'official' });
const libPhoneNumberCountries = getCountries();

const countryOptionsDataMap = Object.fromEntries(
  libPhoneNumberCountries
    .map((code) => {
      const name = libIsoCountries[code];
      const emoji = getFlagEmoji(code);
      if (!name || !emoji) return null;
      return [
        code,
        {
          code,
          name,
          emoji,
        },
      ] as [
        CountryCode,
        {
          code: CountryCode;
          name: string;
          emoji: string;
        },
      ];
    })
    .filter((o) => !!o),
);

const countryOptionsData = Object.values(countryOptionsDataMap);

type Country = (typeof countryOptionsData)[number];

function getFormat(countryCode: CountryCode) {
  const example = getExampleNumber(countryCode, examples)!.formatNational();
  const mask = example.replace(/\d/g, '0');
  return { example, mask };
}

function getInitialDataFromValue(
  value: string | undefined,
  options: {
    initialCountryCode: string;
  },
): {
  country: Country;
  format: ReturnType<typeof getFormat>;
  localValue: string;
} {
  const defaultValue = {
    country: countryOptionsDataMap[options.initialCountryCode],
    format: getFormat(options.initialCountryCode as CountryCode),
    localValue: '',
  };
  if (!value) return defaultValue;
  const phoneNumber = parsePhoneNumberFromString(value);
  if (!phoneNumber) return defaultValue;
  if (!phoneNumber.country) return defaultValue;
  return {
    country: countryOptionsDataMap[phoneNumber.country],
    localValue: phoneNumber.formatNational(),
    format: getFormat(phoneNumber.country),
  };
}

export function PhoneInput({
  initialCountryCode = 'GT',
  value,
  onChange,
  ...props
}: {
  initialCountryCode?: string;
} & Omit<
  PolymorphicComponentProps<typeof IMaskInput, InputBaseProps>,
  'onChange'
> & { onChange: (value: string | null) => void }) {
  const initialData = useRef(
    getInitialDataFromValue(value, {
      initialCountryCode: initialCountryCode,
    }),
  );
  const [country, setCountry] = useState(initialData.current.country);
  const [format, setFormat] = useState(initialData.current.format);
  const [localValue, setLocalValue] = useState(initialData.current.localValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastNotifiedValue = useRef<string | null>(value ?? '');

  useEffect(() => {
    let value = '';
    if (localValue.trim().length > 0) {
      const asYouType = new AsYouType(country.code);
      asYouType.input(localValue);
      value = asYouType.getNumber()!.number;
    }
    if (value !== lastNotifiedValue.current) {
      lastNotifiedValue.current = value;
      onChange(value);
    }
  }, [country.code, localValue]);

  useEffect(() => {
    if (typeof value !== 'undefined' && value !== lastNotifiedValue.current) {
      const initialData = getInitialDataFromValue(value, {
        initialCountryCode,
      });
      lastNotifiedValue.current = value;
      setCountry(initialData.country);
      setFormat(initialData.format);
      setLocalValue(initialData.localValue);
    }
  }, [value]);

  const { readOnly, disabled } = props;
  const leftSectionWidth = 54;

  return (
    <InputBase
      {...props}
      style={{ marginBottom: 'var(--mantine-spacing-md)', ...props.style }}
      component={IMaskInput}
      inputRef={inputRef}
      leftSection={
        <CountrySelect
          disabled={disabled || readOnly}
          country={country}
          setCountry={(country) => {
            setCountry(country);
            setFormat(getFormat(country.code));
            setLocalValue('');
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
          leftSectionWidth={leftSectionWidth}
        />
      }
      leftSectionWidth={leftSectionWidth}
      styles={{
        input: {
          paddingLeft: `calc(${leftSectionWidth}px + var(--mantine-spacing-sm))`,
        },
        section: {
          borderRight: '1px solid var(--mantine-color-default-border)',
        },
      }}
      inputMode="numeric"
      mask={format.mask}
      unmask={true}
      value={localValue}
      onAccept={(value) => setLocalValue(value)}
    />
  );
}

function CountrySelect({
  country,
  setCountry,
  disabled,
  leftSectionWidth,
}: {
  country: Country;
  setCountry: (country: Country) => void;
  disabled: boolean | undefined;
  leftSectionWidth: number;
}) {
  const [search, setSearch] = useState('');

  const selectedRef = useRef<HTMLDivElement>(null);

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setSearch('');
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({
          behavior: 'instant',
          block: 'center',
        });
      }, 0);
    },
  });

  const options = countryOptionsData
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase().trim()),
    )
    .map((item) => (
      <Combobox.Option
        ref={item.code === country.code ? selectedRef : undefined}
        value={item.code}
        key={item.code}
      >
        <Group gap="xs">
          {item.code === country.code && <CheckIcon size={12} />}
          <span>
            {item.emoji} {item.name}
          </span>
        </Group>
      </Combobox.Option>
    ));

  useEffect(() => {
    if (search) {
      combobox.selectFirstOption();
    }
  }, [search]);

  return (
    <Combobox
      store={combobox}
      width={250}
      position="bottom-start"
      withArrow
      onOptionSubmit={(val) => {
        setCountry(countryOptionsDataMap[val]);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target withAriaAttributes={false}>
        <ActionIcon
          variant="transparent"
          onClick={() => combobox.toggleDropdown()}
          size="lg"
          tabIndex={-1}
          disabled={disabled}
          w={leftSectionWidth}
          c="dimmed"
        >
          <Group gap={2}>
            {country.emoji}
            <IconChevronDown size={14} />
          </Group>
        </ActionIcon>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Buscar país"
        />
        <Combobox.Options>
          <ScrollArea.Autosize mah={200} type="scroll">
            {options.length > 0 ? (
              options
            ) : (
              <Combobox.Empty>Não encontrado</Combobox.Empty>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
