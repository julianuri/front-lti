interface AdminConfig {
  auth_login_url: string
  auth_token_url: string
  client_id: string
  deployments: string
  oidc_issuer: string
  openid_url: string
  public_jwk: string
  public_key_url: string
  redirect_uri: string
  target_uri: string
}

export default AdminConfig;
