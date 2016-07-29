export class User {
  id: number;
  name: string = null;
  firstname: string = null;
  lastname: string = null;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
