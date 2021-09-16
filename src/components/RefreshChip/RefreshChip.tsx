import { ReactElement } from 'react';
import Chip from 'components/Chip/Chip';
import { FiRefreshCw } from 'react-icons/fi';

interface Props {
  showText?: boolean;
}

export default function RefreshChip({ showText }: Props): ReactElement {
  return showText ? (
    <Chip>
      Refreshing
      <FiRefreshCw style={{ animation: 'rotating 1.5s linear infinite' }} />
    </Chip>
  ) : (
    <FiRefreshCw
      style={{
        color: 'var(--color-muted)',
        animation: 'rotating 1.5s linear infinite',
      }}
    />
  );
}
