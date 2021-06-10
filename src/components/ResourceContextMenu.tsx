import React from 'react';
import { useHistory } from 'react-router-dom';
import { isValidURL } from '../atomic-lib/client';
import { useStore } from '../atomic-react/hooks';
import { editURL, dataURL, openURL } from '../helpers/navigation';
import { DropdownMenu, MenuItemProps } from './DropdownMenu';

type Props = {
  subject: string;
  // ID's of actions that are hidden
  hide?: string[];
};

/** Dropdown menu that opens a bunch of actions for some resource */
function ResourceContextMenu({ subject, hide }: Props): JSX.Element {
  const store = useStore();
  const history = useHistory();
  // Try to not have a useResource hook in here, as that will lead to many costly fetches when the user enters a new subject

  if (subject == undefined) {
    return null;
  }

  if (!isValidURL(subject)) {
    return null;
  }

  function handleDestroy() {
    if (window.confirm('Are you sure you want to permanently delete this resource?')) {
      const resource = store.getResourceLoading(subject);
      resource.destroy(store);
      history.push('/');
    }
  }

  const items: MenuItemProps[] = [
    { id: 'view', label: 'normal view', helper: 'Open the regular, default View.', onClick: () => history.push(openURL(subject)) },
    { id: 'edit', label: 'edit', helper: 'Open the edit form. (e)', onClick: () => history.push(editURL(subject)) },
    {
      id: 'data',
      label: 'data view',
      helper: 'View the resource and its properties in the Data View. (d)',
      onClick: () => history.push(dataURL(subject)),
    },
    {
      id: 'refresh',
      label: 'refresh',
      helper: 'Fetch the resouce again from the server, possibly see new changes.',
      onClick: () => store.fetchResource(subject, true),
    },
    {
      id: 'delete',
      label: 'delete',
      helper: 'Fetch the resouce again from the server, possibly see new changes.',
      onClick: handleDestroy,
    },
  ];

  const filteredItems = hide ? items.filter(item => !hide.includes(item.id)) : items;

  return (
    <span style={{ float: 'right' }}>
      <DropdownMenu items={filteredItems} />
    </span>
  );
}

export default ResourceContextMenu;
