export interface IPermission {
  route: string;
  method: string;
  action: string;
  [key: string]: any;
}
