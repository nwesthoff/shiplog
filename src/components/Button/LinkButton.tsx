import { ReactElement } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import styles from './Button.module.scss';

export type LinkButtonProps = LinkProps & {
  variant?: 'default' | 'outlined' | 'transparent';
};

export default function LinkButton({ variant, ...props }: LinkButtonProps): ReactElement {
  return (
    <Link className={`${styles.button} ${variant && styles[variant]}`} {...props}>
      {props.children}
    </Link>
  );
}
