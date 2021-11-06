import { ReactElement } from 'react';
import { useSelect } from 'downshift';
import { FiChevronDown } from 'react-icons/fi';
import styles from './Select.module.scss';
import { useLocation } from 'react-router';
import { SiNetlify, SiVercel } from 'react-icons/si';

interface Props {
  items: any[];
  defaultSelectedItem?: any;
  onSelectedItemChange: (item) => void;
}

export default function Select({
  items,
  defaultSelectedItem,
  onSelectedItemChange,
}: Props): ReactElement {
  const location = useLocation();
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useSelect({
    selectedItem: defaultSelectedItem,
    items,
    onSelectedItemChange,
    itemToString: (item) => (item ? item.name : ''),
  });

  function itemBgColor(index, item) {
    if (highlightedIndex === index) {
      return 'var(--color-faintly)';
    } else if (location.pathname.includes(item.id)) {
      return 'var(--color-barely)';
    }
  }

  return (
    <div>
      <div>
        <button {...getToggleButtonProps()} className={styles.selectButton}>
          <div className={styles.selectButtonInnerText}>
            {selectedItem?.name || 'Select Team'}
          </div>
          <FiChevronDown style={{ color: 'var(--color-muted)' }} />
        </button>
      </div>
      <div {...getMenuProps({}, { suppressRefError: true })}>
        {isOpen && (
          <ul id="selectTeam" className={styles.select}>
            {items?.length > 0 &&
              items.map((team, index) => (
                <li
                  {...getItemProps({
                    key: team.id,
                    index,
                    item: team,
                    style: {
                      backgroundColor: itemBgColor(index, team),
                    },
                  })}
                  className={styles.selectItem}
                >
                  {team.service === 'vercel' && (
                    <SiVercel style={{ minWidth: 'var(--space-16)' }} />
                  )}
                  {team.service === 'netlify' && (
                    <SiNetlify style={{ minWidth: 'var(--space-16)' }} />
                  )}
                  {team.name}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
