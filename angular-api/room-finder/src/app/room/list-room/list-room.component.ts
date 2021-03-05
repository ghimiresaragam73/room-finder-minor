import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsgService } from 'src/app/shared/services/msg.service';
import { environment } from 'src/environments/environment';
import { RoomService } from '../services/room.service';
import { NgxPaginationModule } from 'ngx-pagination'
import { UserService } from 'src/app/user/services/user.service';
import { UploadService } from 'src/app/shared/services/upload.service';

@Component({
  selector: 'app-list-room',
  templateUrl: './list-room.component.html',
  styleUrls: ['./list-room.component.css']
})
export class ListRoomComponent implements OnInit {
  // rooms;
  fetchPremium: boolean = false;
  fetchUrgent: boolean = false;
  fetchNormal: boolean = false;
  fetchAll: boolean = true;
  loading: boolean = true;
  imageUrl: string;
  fetchSearch: boolean = false;
  searchedData;
  rooms: any = [];
  p: Number = 1;
  userDetail: any;
  roomAddress: string;
  user: {
    _id: string,
    roomAddress: string
  };
  url: string;
  searchRoom: boolean = true;
  @Input() data1;
  constructor(
    public msgService: MsgService,
    public roomService: RoomService,
    public router: Router,
    public activeRouter: ActivatedRoute,
    public uploadService: UploadService,
    public userService: UserService
  ) {
    this.userDetail = JSON.parse(localStorage.getItem('user'));
    this.imageUrl = environment.roomImageUrl;
    this.url = `${environment.baseUrl}/user/:id`
    activeRouter.queryParams.subscribe(
      params => {
        // console.log('data i n list room', this.data);
        if (params['premium'])
          this.fetchPremium = true;
        if (params['urgent'])
          this.fetchUrgent = true;
        if (params['normal'])
          this.fetchNormal = true
        if (params['address']) {
          this.fetchSearch = true
          this.roomAddress = params['address'];
          this.searchedData = params['address'];
        }
        if (this.fetchNormal || this.fetchPremium || this.fetchUrgent || this.fetchSearch)
          this.fetchAll = false

      }
    )
  }

  ngOnInit():
    void {
    for (let i = 1; i <= 100; i++) {
      if (!this.data1) {
        if (this.fetchSearch) {
          console.log('this.address in search', this.searchedData)
          this.roomService.search({ address: this.searchedData })
            .subscribe(
              data => {
                this.rooms = data;
                if (this.rooms[0]) {
                  this.searchRoom = true;
                } else {
                  this.searchRoom = false;
                }

                this.userService.edit(this.userDetail._id, { roomAddress: this.roomAddress }).subscribe(data => { console.log('this.data in room address', data) }, err => { this.msgService.showError(err) });
              }, err => {
                this.msgService.showError(err);
              }
            )
        }
        if (this.fetchAll) {
          this.roomService.get()
            .subscribe(
              data => {
                console.log(this.fetchPremium, this.fetchUrgent, this.fetchNormal, this.fetchAll);
                this.rooms = data;
                console.log(data);
                this.loading = false;
              },
              err => {
                this.msgService.showError(err);
              }
            )
        } else {
          this.roomService.getByCategories()
            .subscribe(
              data => {
                if (this.fetchNormal)
                  this.rooms = data[2];
                if (this.fetchPremium)
                  this.rooms = data[0];
                if (this.fetchUrgent)
                  this.rooms = data[1];
                this.loading = false;
              },
              err => {
                this.msgService.showError(err);
              }
            )
        }
      } else {
        this.rooms = this.data1;
        console.log('this.data in ngOninit', this.data1)
        this.loading = false;
      }
    }
  }

  isLoggedIn() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }
  roomDashboard(id) {
    this.router.navigate(['/room/dashboard/' + id])
  }

}
