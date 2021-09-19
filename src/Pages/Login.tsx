import { ReactElement } from 'react';
import LoginForm from 'components/LoginForm/LoginForm';

export default function Login(): ReactElement {
  return (
    <div
      style={{
        padding: 'var(--space-16)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <LoginForm />
    </div>
  );
}
