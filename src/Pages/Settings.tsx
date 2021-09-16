import { ReactElement } from 'react';
import Button from 'components/Button/Button';
import { useAuth } from 'hooks/useAuth';

export default function Settings(): ReactElement {
  const { logout } = useAuth();

  return (
    <div>
      <Button onClick={logout}>Log out</Button>
    </div>
  );
}
