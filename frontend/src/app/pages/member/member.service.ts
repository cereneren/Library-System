import { Injectable } from '@angular/core';
import axios from 'axios'
import {Member} from './member'

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor() {}

  getAllMembers(): Promise<any> {
    return axios.get('./api/members');
  }

  getMemberDetail(id: number): Promise<any> {
    return axios.get(`./api/members/${id}`);
  }

  updateMember(request: any): Promise<any> {
    let reqData = {
      fullName: request.fullName,
      email: request.email,
      password: request.password
    }
    return axios.put(`./api/members/${request.id}`, reqData);
  }

  createMember(request: any): Promise<any>{
        let reqData = {
          fullName: request.fullName,
          email: request.email,
          password: request.password
        }
      return axios.post('./api/members', reqData)
  }

  deleteMember(id: number): Promise<any> {
      return axios.delete(`./api/members/${id}`);
    }
}
