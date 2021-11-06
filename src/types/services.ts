export type Service = 'netlify' | 'vercel';

export type User = {
  id: string;
  email: string;
  name: string;
};

export type ReadyState = 'BUILDING' | 'QUEUED' | 'READY' | 'CANCELED' | 'ERROR';
export type Deployment = {
  id: string;
  name: string;
  created: number;
  buildStart: number;
  buildEnd: number;
  state: ReadyState;
  url: string;
  meta: {
    ghUsername: string;
    ghCommitMessage?: string;
    ghRepo?: string;
    ghOrg?: string;
    ghCommitRef?: string;
  };
};

export type Project = {
  id: string;
  name: string;
  accountId: string;
};

export type Team = {
  id: string;
  name: string;
};
