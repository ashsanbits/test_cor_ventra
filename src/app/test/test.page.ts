import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
url: any;
@ViewChild('streaming', {static: false}) streamingcanvas: ElementRef; 

constructor(
    public sanitizer: DomSanitizer,
) { }

ngOnInit() {
}
}
