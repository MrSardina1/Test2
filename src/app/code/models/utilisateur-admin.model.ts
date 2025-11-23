export interface UtilisateurAdmin {
  id: string;
  username: string;
  password: string;
  role: string;
  dernierLogin: string | null;
}
