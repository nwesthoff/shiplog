import { ReactElement, HTMLAttributes } from 'react';
import styles from './Toggle.module.scss';

type Props = HTMLAttributes<HTMLInputElement> & {
  checked?: boolean;
  trueOption?: string;
  falseOption?: string;
};

export default function Toggle({
  checked,
  onChange,
  trueOption = 'true',
  falseOption = 'false',
  ...props
}: Props): ReactElement {
  return (
    <div className={styles.switch}>
      <input type="checkbox" checked={checked} onChange={onChange} {...props} />
      <span className={`${styles.option} ${checked ? styles.active : ''}`}>
        {trueOption}
      </span>
      <span className={`${styles.option} ${!checked ? styles.active : ''}`}>
        {falseOption}
      </span>
    </div>
  );
}
