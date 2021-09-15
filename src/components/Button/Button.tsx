import { AnchorHTMLAttributes, ReactElement } from 'react';
import styles from './Button.module.css';

export default function Button(
  props: AnchorHTMLAttributes<HTMLAnchorElement>
): ReactElement {
  return (
    <a className={styles.button} {...props}>
      {props.children}
    </a>
  );
}
