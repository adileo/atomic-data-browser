import { useState, useEffect } from 'react';
import { Resource, Store } from './store';
import React from 'react';

/** Hook for using a Resource in a React component */
export function useResource(subject: string): Resource {
  const [resource, setResource] = useState(null);
  const store = useStore();

  useEffect(() => {
    // Async code needs to be made sync
    const getResourceAsync = async () => {
      const resource = await store.getResource(subject);
      setResource(resource);
    };
    getResourceAsync();

    // When a component mounts, it needs to let the store know that it will subscribe to changes to that resource.
    function handleResourceUpdated(resource: Resource) {
      // When a change happens, set the new Resource.
      setResource(resource);
    }
    store.subscribe(subject, handleResourceUpdated);

    return () => {
      // When the component is unmounted, unsubscribe from the store.
      store.unsubscribe(subject, handleResourceUpdated);
    };
  }, []);

  return resource;
}

/** Preffered way of using the store in a Component. */
export function useStore(): Store {
  const store = React.useContext(StoreContext);
  if (store == undefined) {
    throw 'Store is undefined, not found in react context. Have you wrapped your application in `<StoreContext.Provider value={new Store}>`?';
  }
  return store;
}

/** The context must be provided by wrapping a high level React element in <StoreContext.Provider value={new Store}> */
export const StoreContext = React.createContext<Store>(undefined);
