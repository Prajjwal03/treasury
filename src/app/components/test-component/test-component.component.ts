import {Component, OnInit} from '@angular/core';

// todo are we using this component
@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss']
})
export class TestComponentComponent implements OnInit {

  constructor() {
  }

  someInputField: any;

  ngOnInit() {
  }

}
