import React, { ReactElement, ReactNode } from 'react';
import styles from './Chip.module.scss';

interface Props {
  children: ReactNode;
}

export default function Chip({ children }: Props): ReactElement {
  return <div className={styles.chip}>{children}</div>;
}
