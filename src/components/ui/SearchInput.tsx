interface SearchInputProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        maxWidth: 360,
        padding: '0.5rem 0.625rem',
        borderRadius: 8,
        border: '1px solid #cbd5e1'
      }}
    />
  );
}
