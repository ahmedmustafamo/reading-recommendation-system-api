export type JwtPayload = {
  email: string;
  sub: number;  // The "sub" (subject) field will hold the user's ID
}
