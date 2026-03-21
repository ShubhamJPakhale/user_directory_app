interface Props {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: Props) => {
  return (
    <input
      placeholder="Search by name or email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBar;
