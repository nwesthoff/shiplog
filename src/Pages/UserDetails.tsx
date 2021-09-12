import { ReactElement, Suspense } from 'react';
import { useVercelUser } from 'services/vercel';

export default function UserDetails(): ReactElement {
  const { data: userData } = useVercelUser();

  return <Suspense fallback="Loading...">{userData?.user?.name}</Suspense>;
}
