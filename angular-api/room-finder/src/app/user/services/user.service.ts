import { HttpClient, HttpHeaders } from '@angular/common/http';
import { escapeIdentifier } from '@angular/compiler/src/output/abstract_emitter';
import { Injectable } from "@angular/core";
import { User } from 'src/app/auth/models/user.model';
import { environment } from 'src/environments/environment';


@Injectable()

export class UserService {
    url: string;
    token: string;
    constructor(
        public http: HttpClient
    ) {
        this.url = environment.baseUrl + '/user';
        this.token = localStorage.getItem('token') || '';
    }

    getOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            })
        }
    }


    edit(id: string, data: any) {
        return this.http.put(`${this.url}/edit/${id}`, data, this.getOptions());
    }

    getById(id: string) {
        return this.http.get(`${this.url}/${id}`, this.getOptions());
    }

    remove(id: string) {
        return this.http.delete(this.url + '/' + id, this.getOptions());
    }
    passwordChange(id: string, data: any) {
        return this.http.put(`${this.url}/${id}`, data, this.getOptions());
    }

}