import React, { ReactElement, Suspense } from 'react';
import { useVercelTeamList } from 'services/vercel';

export default function TeamList(): ReactElement {
  const { data } = useVercelTeamList();

  return (
    <Suspense fallback={'Loading...'}>
      <div>
        {data?.teams?.length > 0 &&
          data.teams.map((team) => {
            return <li key={team.id}>{team.name}</li>;
          })}
      </div>
    </Suspense>
  );
}
