export interface UtilisateurAdmin {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'editor';
  dernierLogin?: string | null;
}
