import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
// import { useToast } from '@/components/ui/use-toast';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { SigninValidation } from '@/lib/validation';
import { z } from 'zod';
import Loader from '@/components/shared/Loader';
import { Link, useNavigate } from 'react-router-dom';
import {
  useSignInAccount,
} from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';

const SigninForm = () => {
  // const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount } =
    useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast.error(
        'Sign in failed! Please try again.',
        {position: 'top-center'}
      );
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate('/');
    } else {
      return toast.error('Sign in failed! Please try again.', {
        position: 'top-center',
      });
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-[420px] flex-center flex-col'>
        <img src='/assets/images/logo.svg' className='h-9' />
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>
          Log in to your account
        </h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>
          Welcome back! Please enter your details.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5 w-full mt-4'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='shad-button_primary'>
            {isUserLoading ? (
              <div className='flex-center gap-2'>
                <Loader /> Loading...
              </div>
            ) : (
              'Sign in'
            )}
          </Button>

          <ToastContainer />

          <p className='text-small-regular text-light-2 text-center mt-2'>
            Don't have an account?
            <Link
              to='/sign-up'
              className='text-primary-500 hover:text-primary-500/85 text-small-semibold'
            >
              {' '}
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
