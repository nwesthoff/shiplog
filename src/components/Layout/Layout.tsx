import Sidebar from 'components/Sidebar/Sidebar';
import { createContext, ReactElement, useEffect, useRef, useState } from 'react';
import { ReactNode } from 'react-router/node_modules/@types/react';
import styles from './Layout.module.css';

interface Props {
  children: ReactNode;
  sidebar?: boolean;
}

export const ScrollProvider = createContext({ layoutScrolled: false });

export default function Layout({ children, sidebar = true }: Props): ReactElement {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [layoutScrolled, setLayoutScrolled] = useState(false);

  function onScroll() {
    const scrollTop = scrollRef?.current?.scrollTop;
    setLayoutScrolled((scrollTop || 0) > 10);
  }

  useEffect(() => {
    onScroll();
  }, [scrollRef]);

  return (
    <div className={styles.layout}>
      <ScrollProvider.Provider value={{ layoutScrolled }}>
        {sidebar && <Sidebar />}
        <main className={styles.main} onScroll={onScroll} ref={scrollRef}>
          {children}
        </main>
      </ScrollProvider.Provider>
    </div>
  );
}
