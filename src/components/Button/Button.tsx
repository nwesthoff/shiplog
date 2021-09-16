import { AnchorHTMLAttributes, ReactElement } from 'react';
import styles from './Button.module.scss';

interface Props {
  variant?: 'default' | 'outlined';
}

export default function Button({
  variant,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & Props): ReactElement {
  return (
    <a className={`${styles.button} ${variant && styles[variant]}`} {...props}>
      {props.children}
    </a>
  );
}
