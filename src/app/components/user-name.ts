import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'UserName'})
export class UserName implements PipeTransform {
  userNameString: any = ''

  transform(str: string): string {
    this.userNameString = str
    if (this.userNameString.match(/^([^@]*)@/) !== null && this.userNameString.match(/^([^@]*)@/) !== undefined) {
      this.userNameString = this.userNameString.match(/^([^@]*)@/)[1]
      this.userNameString = this.userNameString.charAt(0).toUpperCase() + this.userNameString.slice(1)
      var re = /[_.]/g;
      var newstr = this.userNameString.replace(re, " ");
      console.log('sdsdsdsd', newstr)
      console.log('sdsdsdsd', newstr.split(" "))
      this.userNameString = ''
      for (let i in newstr.split(" ")) {
        console.log('this', newstr.split(" ")[i])
        this.userNameString = this.userNameString + newstr.split(" ")[i].charAt(0).toUpperCase() + newstr.split(" ")[i].slice(1) + " "
      }
    } else {
      this.userNameString = this.userNameString.charAt(0).toUpperCase() + this.userNameString.slice(1)
    }
    return this.userNameString
  }
}
