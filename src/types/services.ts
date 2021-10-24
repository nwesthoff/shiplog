export type Service = 'netlify' | 'vercel';

export type User = {
  id: string;
  email: string;
  name: string;
};

export type ReadyState = 'BUILDING' | 'QUEUED' | 'READY';
export type Deployment = {
  id: string;
  name: string;
  created: number;
  buildStart: number;
  buildEnd: number;
  state: ReadyState;
  url: string;
  admin_url?: string;
  creator: {
    username: string;
  };
  meta: {
    ghCommitMessage?: string;
    ghRepo?: string;
    ghCommitSha?: string;
    ghOrg?: string;
    ghCommitRef?: string;
  };
};

export type Project = {
  id: string;
  name: string;
  accountId: string;
};
