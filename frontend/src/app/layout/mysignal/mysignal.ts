import { Component, effect, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-mysignal',
  styleUrl: './mysignal.css',
  templateUrl: './mysignal.html',
})
export class Mysignal {
constructor(){
  effect(()=>{ 
    console.log('count', this.count()); //effect traces the signal 
    
  })
}
count = signal(0)

do(){
  //setting a value
  // this.count.set(50)
  this.count.update(v=> v+20)
}

}
