import { useState } from 'react';
import { TextField, InputAdornment, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchInput({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search',
  size = 'small',
  showButton = true,
  buttonLabel = 'Search',
  sx = {},
  ...props
}) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e) => {
    const v = e.target.value;
    setLocalValue(v);
    onChange?.(v);
  };

  const handleSearch = () => {
    const val = onChange !== undefined ? value : localValue;
    onSearch?.(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ...sx }}>
      <TextField
        size={size}
        placeholder={placeholder}
        value={onChange !== undefined ? value : localValue}
        onChange={onChange !== undefined ? (e) => onChange(e.target.value) : handleChange}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 220 }}
        {...props}
      />
      {showButton && (
        <Button variant="outlined" onClick={onSearch ? () => onSearch(onChange !== undefined ? value : localValue) : handleSearch} size={size}>
          {buttonLabel}
        </Button>
      )}
    </Box>
  );
}
