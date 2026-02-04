import { useState, useEffect, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { login, register } from '../../store/auth/authAction';
import { clearError } from '../../store/auth/authSlice';
import { useToast } from '../../context/ToastContext';
import { getPasswordErrors } from '../../utils/validation';
import Input from '../../components/common/Input';
import AppButton from '../../components/common/AppButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { loading, error } = useSelector((state) => state.auth);

  const isRegister = location.pathname === '/signup';
  const from = location.state?.from?.pathname || '/dashboard';

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const confirmPasswordError = isRegister && confirmPassword.length > 0 && !passwordsMatch;
  const passwordErrors = getPasswordErrors(password);
  const passwordInvalid = passwordErrors !== null && passwordErrors.length > 0;

  const isLoginDisabled =
    loading || !email.trim() || !password;

  const isRegisterDisabled =
    loading ||
    !name.trim() ||
    !email.trim() ||
    !password ||
    !confirmPassword ||
    getPasswordErrors(password) !== null ||
    password !== confirmPassword;

  useEffect(() => {
    if (!isRegister) {
      setConfirmPassword('');
      setFieldErrors({});
    }
  }, [isRegister, location.pathname]);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      dispatch(clearError());
    }
  }, [error, showToast, dispatch]);

  const validate = () => {
    const err = {};
    if (!email.trim()) err.email = 'Email is required';
    if (!password) err.password = 'Password is required';
    if (isRegister) {
      if (!name.trim()) err.name = 'Name is required';
      const pwdErr = getPasswordErrors(password);
      if (pwdErr && pwdErr.length > 0) err.password = pwdErr.join(' ');
      if (password !== confirmPassword) err.confirmPassword = 'Passwords do not match';
    }
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    // Basic validation (length, character rules, required fields) first; only then call API.
    if (!validate()) return;
    if (isRegister) {
      const result = await dispatch(register({ name: name.trim(), email: email.trim(), password }));
      if (register.fulfilled.match(result)) {
        showToast('Account created successfully', 'success');
        navigate(from, { replace: true });
      }
    } else {
      const result = await dispatch(login({ email: email.trim(), password }));
      if (login.fulfilled.match(result)) {
        showToast('Login successfully', 'success');
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: '100%',
          boxShadow: 4,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ p: 3.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1 }}>
            <BusinessCenterIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight={700} letterSpacing="-0.02em">
              MINI CRM
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
            {isRegister ? 'Create an account to get started' : 'Sign in to continue'}
          </Typography>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <Input
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
                autoComplete="name"
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
              />
            )}
            <Input
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
            />
            <Input
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              showPasswordToggle
              error={!!fieldErrors.password || !!passwordInvalid}
              helperText={
                fieldErrors.password ? (
                  fieldErrors.password
                ) : passwordErrors && passwordErrors.length > 0 ? (
                  <>
                    {passwordErrors.map((msg, i) => (
                      <Fragment key={i}>
                        {msg}
                        {i < passwordErrors.length - 1 ? <br /> : null}
                      </Fragment>
                    ))}
                  </>
                ) : (
                  ''
                )
              }
            />
            {isRegister && (
              <Input
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="new-password"
                showPasswordToggle
                showMatchIndicator
                isMatch={passwordsMatch}
                error={!!fieldErrors.confirmPassword || confirmPasswordError}
                helperText={fieldErrors.confirmPassword || (confirmPasswordError ? 'Passwords do not match' : '')}
              />
            )}
            <AppButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isRegister ? isRegisterDisabled : isLoginDisabled}
              sx={{ mt: 3, mb: 1.5, py: 1.5 }}
            >
              {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : isRegister ? 'Register' : 'Login'}
            </AppButton>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" align="center" color="text.secondary">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link
                component="button"
                type="button"
                onClick={() => {
                  navigate(isRegister ? '/login' : '/signup');
                  dispatch(clearError());
                  setFieldErrors({});
                  setConfirmPassword('');
                }}
                sx={{ fontWeight: 600 }}
              >
                {isRegister ? 'Login' : 'Register'}
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
