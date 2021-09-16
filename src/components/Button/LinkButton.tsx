import { ReactElement } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import styles from './Button.module.scss';

interface Props {
  variant?: 'default' | 'outlined' | 'transparent';
}

export default function LinkButton({
  variant,
  ...props
}: LinkProps & Props): ReactElement {
  return (
    <Link className={`${styles.button} ${variant && styles[variant]}`} {...props}>
      {props.children}
    </Link>
  );
}
