import { ReactElement, ReactNode } from 'react';
import LinkButton, { LinkButtonProps } from 'components/Button/LinkButton';
import styles from './ProjectList.module.scss';

interface Props {
  children: ReactNode;
}

export default function ProjectButton({
  children,
  ...props
}: LinkButtonProps & Props): ReactElement {
  return (
    <LinkButton {...props}>
      <span className={styles.innerProjButton}>{children}</span>
    </LinkButton>
  );
}
