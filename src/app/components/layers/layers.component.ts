import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss'],
})
export class LayersComponent implements OnInit {

  @Input('event') event: any;
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

  public MUNIC = [
    {
      name: 'Albert Luthuli',
      isChecked: true
    },
    {
      name: 'Dipaleseng',
      isChecked:true
    },
    {
      name: 'Govan Mbeki',
      isChecked: true,
      borderline: '!4m5!3m4!1s0x1eeb8d69cec5c3e7:0x6f0a14c21c7465bd!8m2!3d-26.5470697!4d29.9740534'
    },
  
    {
      name: 'Lekwa',
      isChecked:true
    },
    
    {
      name: 'Mkhondo',
      isChecked:true
    },
    {
      name: 'Msukaligwa',
      isChecked:true
    },
    {
      name: 'Pixley Ka Seme',
      isChecked:true
    },
   
  ];

  constructor() { }

  ngOnInit() {
    switch (this.event) {
      case 'SURF_TYPE':
        this.list = this.SURF_TYPE;
        break;

        case 'MUNIC':
        this.list = this.MUNIC;
        break;
    
      default:
        break;
    }
  }

}
