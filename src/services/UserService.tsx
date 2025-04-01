import api from "./api";

export class UserService {
  getUsers(){
    return api.get("/users")
  }
}