import { TextInput, PasswordInput, Button } from '@mantine/core';
import { schemaSignin } from '../../../schemas/schemaSignin';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../../AuthContext'

interface SigninFormValues {
  USER_EMAIL?: string;
  USER_PASSWORD?: string;
}

export default function ModalSignin() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schemaSignin)
  })

  const submitForm = (data: SigninFormValues) => {
    console.log(data)
    login();
  }
  
  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <TextInput
          {...register('USER_EMAIL')}
          label="Email"
          placeholder="your@email.com"
          required
          error={errors.USER_EMAIL?.message}
          />
        <PasswordInput
          {...register('USER_PASSWORD')}
          label="Password"
          placeholder="Your password"
          required
          error={errors.USER_PASSWORD?.message}
        />
        <Button type='submit' fullWidth mt="xl">
          Sign in
        </Button>
      </form>
    </>
  );
}