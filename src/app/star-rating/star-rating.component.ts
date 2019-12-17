import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnInit, OnChanges {

  @Input()
  rating: number;
  starWidth: number;

  @Output()
  ratingClicked: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.starWidth = this.rating * 71 / 5;
  }

  ratingClick() {
    this.ratingClicked.emit(`Product rating ${this.rating} clicked`);
  }

}
