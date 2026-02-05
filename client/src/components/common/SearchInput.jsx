import { useState, useRef, useEffect } from 'react';
import { TextField, InputAdornment, Button, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const EXPANDED_WIDTH = 220;
const ANIMATION_DURATION_MS = 250;

export default function SearchInput({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search',
  size = 'small',
  showButton = true,
  buttonLabel = 'Search',
  expandable = false,
  sx = {},
  ...props
}) {
  const [localValue, setLocalValue] = useState(value);
  const [expanded, setExpanded] = useState(false);
  const [openWidth, setOpenWidth] = useState(0);
  const isClosingRef = useRef(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (expandable && expanded && openWidth === 0 && !isClosingRef.current) {
      const id = requestAnimationFrame(() => {
        setOpenWidth(EXPANDED_WIDTH);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [expandable, expanded]);

  useEffect(() => {
    if (openWidth === EXPANDED_WIDTH && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openWidth]);

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
    if (expandable && e.key === 'Escape') {
      handleCollapse();
    }
  };

  const handleCollapse = () => {
    isClosingRef.current = true;
    setOpenWidth(0);
  };

  const handleTransitionEnd = (e) => {
    if (e.propertyName === 'width' && openWidth === 0 && isClosingRef.current) {
      setExpanded(false);
      isClosingRef.current = false;
    }
  };

  const handleExpand = () => {
    setExpanded(true);
    setOpenWidth(0);
  };

  const handleBlur = () => {
    if (!(onChange !== undefined ? value : localValue)?.trim()) {
      handleCollapse();
    }
  };

  if (expandable) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ...sx }}>
        {!expanded ? (
          <IconButton
            size={size}
            onClick={handleExpand}
            aria-label="Show search"
            sx={{ color: 'text.secondary' }}
          >
            <SearchIcon />
          </IconButton>
        ) : (
          <Box
            onTransitionEnd={handleTransitionEnd}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              width: openWidth,
              minWidth: openWidth,
              overflow: 'hidden',
              transition: `width ${ANIMATION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            <TextField
              inputRef={inputRef}
              size={size}
              placeholder={placeholder}
              value={onChange !== undefined ? value : localValue}
              onChange={onChange !== undefined ? (e) => onChange(e.target.value) : handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: EXPANDED_WIDTH }}
              {...props}
            />
            <IconButton size="small" onClick={handleCollapse} aria-label="Close search" sx={{ color: 'text.secondary', p: 0.5, flexShrink: 0 }}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  }

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
