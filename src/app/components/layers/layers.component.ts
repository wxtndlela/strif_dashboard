import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss'],
})
export class LayersComponent implements OnInit {

  public list = [];

  public SURF_TYPE = [
    {
      name: 'BLOCK',
      isChecked: true,
      borderline: '!4m5!3m4!1s0x1eeb8d69cec5c3e7:0x6f0a14c21c7465bd!8m2!3d-26.5470697!4d29.9740534'
    },
    {
      name: 'FLEX',
      isChecked: true
    },
    {
      name: 'GRAV',
      isChecked:true
    },
    
  ];

  constructor() { }

  ngOnInit() {
    this.list = this.SURF_TYPE
  }

}
