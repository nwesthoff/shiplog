import Header from 'components/Header/Header';
import { ReactElement, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props): ReactElement {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
