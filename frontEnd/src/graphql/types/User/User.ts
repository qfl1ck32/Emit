export interface User {
  _id: any;
  username: string;
  email: string;
  isSetUp: boolean;
  image: string | null;
  whitelist: string[];
  blacklist: string[];
}
