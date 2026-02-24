import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
constructor(private http:HttpClient){}
doget(){
  return this.http.get('https://jsonplaceholder.typicode.com/posts').subscribe((data)=> console.log(data)
  )
}
dogetbyparams(){
  return this.http.get('https://jsonplaceholder.typicode.com/comments?postId=1').subscribe((param) => console.log(param)
  )
    
}

}
// https://jsonplaceholder.typicode.com/