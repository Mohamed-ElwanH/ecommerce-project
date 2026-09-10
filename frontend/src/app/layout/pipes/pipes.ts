import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, JsonPipe, LowerCasePipe, PercentPipe, SlicePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NOSpace } from '../../core/pipes/nospace.pipes';

@Component({
  imports: [UpperCasePipe, LowerCasePipe, TitleCasePipe, DatePipe, PercentPipe, CurrencyPipe, DecimalPipe, JsonPipe, SlicePipe,AsyncPipe, NOSpace],
  selector: 'app-pipes',
  styleUrl: './pipes.css',
  templateUrl: './pipes.html',
})
export class Pipes {

  name = 'mona ali ahmed'
  nameTwo = 'SARA ALI AHMED'

  myDate = new Date();

  grade = 22/150

  price = 22.3039530901

  asyncData = new Promise((resolve,reject)=>{
    setTimeout(()=>resolve('Data from promise'), 3000)
  })
}
