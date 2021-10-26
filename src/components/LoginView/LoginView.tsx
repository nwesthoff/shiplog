import { ReactElement, useState } from 'react';
import Header from 'components/Header/Header';
import Layout from 'components/Layout/Layout';
import LoginFormService from './LoginFormService';
import { SiNetlify, SiVercel } from 'react-icons/si';
import { Service } from 'types/services';

export default function LoginForm(): ReactElement {
  const [open, setOpen] = useState<Service>();

  function handleOpen(service: Service) {
    if (open === service) {
      setOpen(undefined);
    } else {
      setOpen(service);
    }
  }

  return (
    <Layout sidebar={false}>
      <Header>
        <h1>Login</h1>
      </Header>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          paddingTop: 'var(--space-32)',
        }}
      >
        <div
          style={{
            display: 'flex',
            maxWidth: '320px',
            gap: 'var(--space-16)',
            flexDirection: 'column',
          }}
        >
          <LoginFormService
            setOpen={() => handleOpen('vercel')}
            icon={SiVercel}
            service="vercel"
            tokenUrl="https://vercel.com/account/tokens"
            open={open === 'vercel'}
          />
          <LoginFormService
            brandColor="#30C8C9"
            setOpen={() => handleOpen('netlify')}
            icon={SiNetlify}
            service="netlify"
            tokenUrl="https://app.netlify.com/user/applications#personal-access-tokens"
            open={open === 'netlify'}
          />
        </div>
      </div>
    </Layout>
  );
}
