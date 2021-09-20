import { ReactElement } from 'react';
import { AnchorHTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface Props {
  variant?: 'default' | 'outlined' | 'transparent';
}

export default function AnchorButton({
  variant,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & Props): ReactElement {
  return (
    <a className={`${styles.button} ${variant && styles[variant]}`} {...props}>
      {props.children}
    </a>
  );
}
