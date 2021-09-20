import { ReactElement } from 'react';
import { ButtonHTMLAttributes } from 'react-router/node_modules/@types/react';
import styles from './Button.module.scss';

interface Props {
  variant?: 'default' | 'outlined' | 'transparent';
}

export default function Button({
  variant,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & Props): ReactElement {
  return (
    <button className={`${styles.button} ${variant && styles[variant]}`} {...props}>
      {props.children}
    </button>
  );
}
