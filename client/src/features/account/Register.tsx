import { Alert, AlertTitle, LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/store/configureStore';
import { signInUser } from './accountSlice';
import agent from '../../app/api/agent';
import { useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { toast } from 'react-toastify';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

export default function Register() {
    const navigate = useNavigate();
    const { register, handleSubmit,setError, formState: { isSubmitting, errors, isValid } } = useForm({
        mode: 'onTouched'
    });

    function handleApiErrors(errors: any) {
        if (errors) {
            errors.forEach((error: string) => {
                if (error.includes('Password')) {
                    setError('password', { message: error });
                } else if (error.includes('Email')) {
                    setError('email', { message: error });
                } else if (error.includes('Username')) {
                    setError('username', { message: error });
                }
            });
        }
    }

    return (
        <Card variant="outlined">
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
                Register
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit(data => agent.Account.register(data)
                    .then(() => {
                        toast.success('Registration successful - you can now login');
                        navigate('/login');
                    })
                    .catch(error => handleApiErrors(error)))}
                noValidate
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: 2,
                }}
            >
                <FormControl>
                    <TextField
                        placeholder="Username"
                        autoFocus
                        fullWidth
                        {...register('username', { required: 'Username is required' })}
                        error={!!errors.username}
                        helperText={errors?.username?.message as string}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        placeholder="Email"
                        fullWidth
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                                message: 'Not a valid email address'
                            }
                        })}
                        error={!!errors.email}
                        helperText={errors?.email?.message as string}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        placeholder="Password"
                        type="password"
                        fullWidth
                        {...register('password', {
                            required: 'Password is required',
                            pattern: {
                                value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                                message: 'Password does not meet complexity requirements'
                            }
                        })}
                        error={!!errors.password}
                        helperText={errors?.password?.message as string}
                    />
                </FormControl>
                <LoadingButton loading={isSubmitting}
                    disabled={!isValid}
                    type="submit"
                    fullWidth
                    variant="contained"
                >
                    Register
                </LoadingButton>
            </Box>
            <Divider>or</Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography sx={{ textAlign: 'center' }}>
                    Already have an account?{' '}
                    <Link
                        to='/login'
                    >
                        Sign in
                    </Link>
                </Typography>
            </Box>
        </Card>
    );
}
