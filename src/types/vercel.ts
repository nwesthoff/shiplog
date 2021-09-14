export type VercelUser = {
  uid: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  softBlock: null;
  date: string;
  platformVersion: null;
  billing: {
    plan: 'hobby' | 'pro';
    period: null;
    trial: null;
    cancelation: null;
    addons: null;
    email: null;
    tax: null;
    language: null;
    address: null;
    name: null;
  };
  bio: null;
  website: string;
  stagingPrefix: string;
  resourceConfig: { concurrentBuilds: number };
  importFlowGitProvider: 'github';
  importFlowGitNamespaceId: string;
};

export type VercelSubscription = {
  id: string;
  trial: null;
  period: { start: number; end: number };
  frequency: { interval: string; intervalCount: number };
  discount: null;
  items: VercelSubscriptionItem[];
};

export type VercelSubscriptionItem = {
  id: string;
  priceId: string;
  productId: string;
  amount: number;
  quantity: number;
};

export type VercelTeam = {
  id: string;
  slug: string;
  name: string;
  creator_id: string;
  creatorId: string;
  created: string;
  createdAt: number;
  updatedAt: number;
  avatar: string;
  membership: {
    role: 'MEMBER' | 'ADMIN' | 'OWNER';
    confirmed: true;
    created: number;
    createdAt: number;
    teamId: string;
    updatedAt: number;
  };
  platformVersion: number;
  billing: {
    plan: 'pro' | 'hobby';
    period: { start: number; end: number };
    trial: null;
    cancelation: null;
    addons: null;
    platform: string;
    email: string;
    tax: null;
    language: null;
    address: null;
    name: string;
    overdue: null;
    invoiceItems: {
      pro: { price: number; quantity: number; hidden: false };
      teamSeats: { hidden: false; price: number; quantity: number };
      concurrentBuilds: { hidden: false; price: number; quantity: number };
      passwordProtection: {
        quantity: 1;
        price: number;
        hidden: false;
        createdAt: number;
      };
    };
    subscriptions: VercelSubscription[];
    currency: 'usd' | 'eur';
  };
  description: null;
  profiles: [];
  stagingPrefix: string;
  resourceConfig: { concurrentBuilds: number };
  softBlock: null;
  allowProjectTransfers: true;
};

export type VercelDeployment = {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: string;
  type: string;
  creator: {
    uid: string;
    email: string;
    username: string;
    githubLogin: string;
  };
  meta: {
    githubCommitAuthorName: string;
    githubCommitMessage: string;
    githubCommitOrg: string;
    githubCommitRef: string;
    githubCommitRepo: string;
    githubCommitRepoId: string;
    githubCommitSha: string;
    githubDeployment: string;
    githubOrg: string;
    githubRepo: string;
    githubRepoId: string;
    githubCommitAuthorLogin: string;
  };
  target: 'production' | 'staging';
  aliasAssigned?: boolean;
};
