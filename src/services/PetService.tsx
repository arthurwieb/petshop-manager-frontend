import { BaseService } from "./BaseService";

export class PetService extends BaseService {
  constructor(){
    super("/pets")
  }
}