import { ReactElement } from 'react';
import styles from './Header.module.scss';
import { ReactNode, useContext } from 'react';
import { ScrollProvider } from 'components/Layout/Layout';

interface Props {
  children: ReactNode;
}

export default function Header({ children }: Props): ReactElement {
  const { layoutScrolled } = useContext(ScrollProvider);

  return (
    <header className={`${styles.header} ${layoutScrolled && styles.scrolled}`}>
      {children}
    </header>
  );
}
