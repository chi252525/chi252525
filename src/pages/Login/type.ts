export interface token {
  exp: Date;
  iat: Date;
  iss: string;
  jti: string;
  orgId: string;
  roles: Array<string>;
  sub: string;
}
