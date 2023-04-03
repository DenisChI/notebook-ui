import { Phone } from "./phone.model";

export interface Person {
  personId: number;
  firstName: string;
  lastName: string;
  birthYear: number;
  phones: Phone[];
}

export { Phone };
