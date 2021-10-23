export type ReadyState = string;

export type NetlifyUser = {
  email: string;
  affiliate_id: string;
  avatar: string;
  avatar_url: string;
  connected_accounts: { github: string };
  created_at: string;
  full_name: string;
  has_pending_email_verification: boolean;
  id: string;
  last_login: string;
  login_providers: string[];
  mfa_enabled: boolean;
  onboarding_progress: { overview: string };
  pending_email?: string;
  preferred_account_id: string;
  saml_account_id: string;
  saml_slug?: string;
  sandbox: boolean;
  site_count: number;
  slug: string;
  tracking_id: string;
  uid?: string;
};
