import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Child } from '../child/child';

@Component({
  imports: [Child],
  selector: 'app-parent',
  styleUrl: './parent.css',
  templateUrl: './parent.html',
})
export class Parent implements OnInit, AfterViewInit {
  // @ViewChild(Child) myChild!: Child;
  names = ['ali', 'mona', 'omar'];
  @ViewChildren(Child) myChildren!: QueryList<Child>;
  ngAfterViewInit(): void {
    // this.myChild.setMsg('Hello from parent');
  }
  //component life cycle
  //1
  constructor() {}
  //2
  //ngOnChanges(){}
  //3
  ngOnInit(): void {}
  //4
  // ngDoCheck(){} but this got removed since angular 21

  //5
  //ngAfterContentInit(){}

  //6
  //  ngAfterContentChecked(){}

  //7  ngAfterViewInit(){}
  //8 ngAfterViewChecked(){}
  //9 ngOnDestroy(){} //last event in the life of a component (when its not on screen)

  do() {
    // this.myChild.setMsg('Hello from parent');
    //this.myChild.setMsg = "Hello from parent" but this didnt work for me
    this.myChildren.forEach((item, index) => {
      item.myName = index + '-' + item.myName;
      item.cdrChild();
    });
  }
}
