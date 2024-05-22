import {Component, OnInit} from '@angular/core';

// todo are we using this component?
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  dropDownBranch = [];
  dropDownSSC = [];
  dropDownAML = [];
  dropdownSettings = {};
  branch: string = "Select"
  userType: string = "Select"
  user: any
  role: any
  singaporeUser = ["Yuvaraj", "Nadeem", "Ajith", "Dheep"];
  manilaUser = ["Raj", "Sheela", "Naresh"]
  taiPeiUser = ["Rose", "Green", "Test User"]
  selectedUser: any
  selectedRole: any

  constructor() {
  }

  ngOnInit() {
    this.selectedUser = "Select"
    this.selectedRole = this.dropDownBranch
    this.dropDownBranch = [
      {item_id: 1, item_text: 'Branch Maker'},
      {item_id: 2, item_text: 'Branch Approver'}
    ]
    this.dropDownSSC = [
      {item_id: 1, item_text: 'SSC Maker'},
      {item_id: 2, item_text: 'SSC Approver'}
    ]
    this.dropDownAML = [
      {item_id: 1, item_text: 'ALM Maker'},
      {item_id: 2, item_text: 'ALM Approver'}
    ]
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select",
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      classes: "myclass",
      allowSearchFilter: true
    };
  }

  onChange(event) {

    this.selectedUser = "select"
    if (event === "singaporeUser") {
      this.selectedUser = this.singaporeUser
    } else if (event === "manilaUser") {
      this.selectedUser = this.manilaUser
    } else if (event === "taiPeiUser") {
      this.selectedUser = this.taiPeiUser
    }
  }

  onDropDownChange(event) {
    if (event === 'branch') {
      this.userType = 'branch'
    } else if (event === 'ssc') {
      this.userType = 'ssc'
    } else if (event === 'aml') {
      this.userType = 'aml'
    }
  }
}
