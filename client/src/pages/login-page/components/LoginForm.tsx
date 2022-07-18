import { FormInputType } from 'types/interfaces';
import { AlertModal } from 'common/components';
import Loading from 'common/components/loading';
import CustomForm from './CustomForm';
import { LoginButton } from './LoginFormStyle';
import useLogin from '../hook/useLogin';

const LoginForm = () => {
  const { asyncLogin, error, isLoading, isError, setIsError } = useLogin();

  const onSubmit = async (data: FormInputType) => {
    asyncLogin(data);
  };

  const handleConfirm = () => {
    setIsError(false);
  };

  return (
    <>
      {isLoading && <Loading />}
      <CustomForm onSubmit={onSubmit}>
        <LoginButton type="submit">Login</LoginButton>
      </CustomForm>
      {isError && <AlertModal message={error} handleConfirm={handleConfirm} />}
    </>
  );
};

export default LoginForm;
