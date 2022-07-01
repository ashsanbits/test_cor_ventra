import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  options = {
    weekdays: ['Su','Mo','Tue','Wed','Thu','Fri','Sat'],
    to: new Date(),
    from: new Date('01-01-2010'),
  }
  @ViewChild('content') private content: any;
  max = new Date().toISOString();
  devices: any;
  latitude: number = 45.349492204568115;
  longitude: number = -75.8056184300331;
  zoom = 15;
  username = localStorage.getItem('ventra_user')
  password = localStorage.getItem('ventra_pass')
  origin: any;
  destination: any;
  st_tame: any;
  et_tame: any;
  user = localStorage.getItem('user_type');
  device = localStorage.getItem('deviceid');
  date: string;
  type: 'string'; 
  public renderOptions = {
    suppressMarkers: true,
}
  public markerOptions = {
    origin: {
        icon: 'https://www.shareicon.net/data/32x32/2016/04/28/756617_face_512x512.png',
        // label: 'Origin'
    },
    destination: {
        icon: 'https://www.shareicon.net/data/32x32/2016/04/28/756626_face_512x512.png',
        // label: 'Destination',
        // opacity: 0.8,
    },
  }
  selectedDate: string;
  endCheck: number;
  startCheck: number;

  endDateCheck = 0;
  

  startTime: any;
  endTime: any;
  deviceSelected: any;

  gaps = 21;
  newIncLength = 21;
  directionsService;
  directionsDisplay;
  passedData = {};
  timeout = 0;
  orig;
  destine;
  polyline: any;


  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  points = [];
  gmarkers = [];
  flightPath: google.maps.Polyline;
  bounds: google.maps.LatLngBounds;
  marker: any;
  flightPathHour: google.maps.Polyline;
  hours = [];
  iosPlatform: any;
  constructor(
    public api: HttpService,
    private router: Router,
    // private datePicker: DatePicker,
    private platform: Platform
  ) {}
  ngOnInit() {
    this.platform.ready().then(re => {
      if(this.platform.is('ios')) {
        this.iosPlatform = true;
      } else {
        this.iosPlatform = false;
      }
    }) 
    for(let hour = 0; hour < 24; hour++) {
      this.hours.push(moment({ hour }).format('h:mm A'));
    }
    this.date = moment(new Date()).format('yyyy-MM-DD');
    this.startTime = moment().startOf('day').format('hh:mm A').toString();
    this.endTime = moment().endOf('day').format('hh:mm A').toString();
  }
  ionViewWillEnter() {
    this.bounds = new google.maps.LatLngBounds();
    this.directionsService = new google.maps.DirectionsService;
    this.ngAfterViewInit();
    this.selectedDate = moment().format('yyyy-MM-DD');
    this.devices = JSON.parse(localStorage.getItem('devices'));
    this.points = [];
  }
  gpsData() {
    const date = moment(this.date).format('yyyy-MM-DD');
    this.startCheck = moment(date + ' ' + this.startTime).unix().valueOf();
    this.endCheck = moment(date + ' ' + this.endTime).unix().valueOf();
    const body = 'username=' + this.username + '&password=' + this.password  + '&deviceid=' + this.deviceSelected  + '&end=' + this.endCheck  + '&start=' + this.startCheck;
    this.api.ventra_post('api/gps', body, true).subscribe(data => {
        this.points = [];
        if(data.length > 0 ) {
          this.content.scrollToTop(0);
          this.origin = {
            lat: Number(data[0].lat),
            lng: Number(data[0].lng),
          }
          this.destination = {
            lat: Number(data[data.length-1].lat),
            lng: Number(data[data.length-1].lng),
          }
          data.forEach(element => {
            this.points.push({lat:parseFloat(element.lat),lng:parseFloat(element.lng), time: element.time})
          });
          let latlng = new google.maps.LatLng(parseFloat(this.origin.lat), parseFloat(this.origin.lng));
          this.createMarker(latlng,'Origin')
          this.calculatewaypoint();
        } else {
        this.api.presentAlertConfirm('No Record Exist!','assets/no-record.png')
        }
    })
  }
  ngAfterViewInit() {
    this.map =  new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 6,
      center: {
        lat: this.latitude,
        lng: this.longitude
      }
    });
  }
  calculatewaypoint() {
    let latlng = new google.maps.LatLng(parseFloat(this.origin.lat), parseFloat(this.origin.lng));
    this.map.setCenter(latlng)
    this.map.setZoom(20)
    this.flightPath = new google.maps.Polyline({
      path: this.points,
      geodesic: true,
      strokeColor: "#114cde",
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });
  
    this.flightPath.setMap(this.map);
    let dest = new google.maps.LatLng(parseFloat(this.destination.lat), parseFloat(this.destination.lng));
    this.createMarker(dest,'Destination');
  }
  createMarker(latlng, label) {
    this.marker = new google.maps.Marker({
      position: latlng,
      map: this.map,
      label: {text: label, color: "white"},
    });
    this.gmarkers.push(this.marker);
  }
  reload() {
    this.points = []
    if(this.flightPath) {
      this.gmarkers.forEach(element => {
      if(this.flightPathHour) {
        this.flightPathHour.setMap(null);
      }
      element.setMap(null);
      });
      this.gmarkers = [];
      this.flightPath.setMap(null);
    }
  }

  showDatepicker(){
    // this.datePicker.show({
    //   date: new Date(),
    //   maxDate: new Date(),
    //   mode: 'date',
    //   okText:"Save Date",
    //   todayText:"Set Today"
    // }).then(
    //   data => {
    //     this.date = moment(data).format('yyyy-MM-DD');
    //     // this.myDate = date.getDate()+"/"+date.toLocaleString('default', { month: 'long' })+"/"+date.getFullYear();
    //   },
    //   err => console.log('Error occurred while getting date: ', err)
    // );
  }  

  startTimepicker(ev){
    this.st_tame = ev.target.value
    this.startTime = moment(ev.target.value).format('hh:mm A').toString();
    // this.datePicker.show({
    //   date: new Date(),
    //   mode: 'time',
    //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
    //   okText:"Save Time",
    //   nowText:"Set Now"
    // }).then(
    //   time => {
    //     this.startTime = moment(time).format('hh:mm A').toString();
    //   },
    //   err => console.log('Error occurred while getting time: ', err)
    // );
  }  
  endTimepicker(ev){
    this.et_tame = ev.target.value
    this.endTime = moment(ev.target.value).format('hh:mm A').toString();
    // this.datePicker.show({
    //   date: new Date(),
    //   mode: 'time',
    //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
    //   okText:"Save Time",
    //   nowText:"Set Now"
    // }).then(
    //   time => {
    //     this.endTime = moment(time).format('hh:mm A').toString();
    //   },
    //   err => console.log('Error occurred while getting time: ', err)
    // );
  }  
  dateSelection(ev) {
    this.date = ev.target.value;
  }
  hourlyColorPath(ev) {
    console.log(ev)
    const value = ev.target.value;
    let time = value.split(':');
    let meridan = value.split(' ');
    
    let date = moment(this.date).format('yyyy-MM-DD');
    let start = moment(time + ':00 ' +meridan, 'h:mm a').format('hh:mm:a');
    let end = moment(time + ':59 '+meridan,'h:mm a').format('hh:mm:a');
    let st = moment(date + ' ' + start).unix().valueOf();
    let et = moment(date + ' ' + end).unix().valueOf();
    if(this.flightPathHour) {
      this.flightPathHour.setMap(null);
    }
    let path = [];
    this.points.forEach(element => {
      if(element.time >= st && element.time <= et) {
        path.push(element);
      }
    });
    if (path.length > 0) {
      let latlng = new google.maps.LatLng(parseFloat(path[0].lat), parseFloat(path[0].lng));
      this.map.setCenter(latlng)
      this.map.setZoom(22)
      this.flightPathHour = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#b71c1c",
        strokeOpacity: 10,
        strokeWeight: 6,
      });
      this.flightPathHour.setMap(this.map);
    }
  }
}
