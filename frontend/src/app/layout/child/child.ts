import { Component, ChangeDetectorRef, Input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-child',
  styleUrl: './child.css',
  templateUrl: './child.html',
})
export class Child {
  msg = '';

  constructor(private _cdr: ChangeDetectorRef) {}
  @Input() myName !:string
  setMsg(msg: string) {
    this.msg = msg;
    this._cdr.detectChanges();
  }
  cdrChild(){
    this._cdr.detectChanges();
  }
}