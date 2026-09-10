import { Pipe, PipeTransform } from "@angular/core";
@Pipe({name:'noSpace'})
export class NOSpace implements PipeTransform{
    transform(value: any, ...args: any[]) {
        return value.replaceAll(' ', '') //replace space with empty string
    }
    
}