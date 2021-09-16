import Sidebar from 'components/Sidebar/Sidebar';
import { createContext, ReactElement, useEffect, useRef, useState } from 'react';
import styles from './Layout.module.css';

interface Props {
  children: ReactElement;
}

export const ScrollProvider = createContext({ layoutScrolled: false });

export default function Layout({ children }: Props): ReactElement {
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
      <Sidebar />
      <ScrollProvider.Provider value={{ layoutScrolled }}>
        <main className={styles.main} onScroll={onScroll} ref={scrollRef}>
          {children}
        </main>
      </ScrollProvider.Provider>
    </div>
  );
}
