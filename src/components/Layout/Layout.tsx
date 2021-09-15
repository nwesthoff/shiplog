import Header from 'components/Header/Header';
import { ReactElement, ReactNode } from 'react';
import styles from './Layout.module.css';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props): ReactElement {
  return (
    <div className={styles.layout}>
      <Header />
      {children}
    </div>
  );
}
