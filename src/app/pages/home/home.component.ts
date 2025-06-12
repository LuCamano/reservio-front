import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';


export interface State {
  name: string;
  Locales: string;
}
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  stateCtrl = new FormControl('');
  filteredStates: Observable<State[]>;

  states: State[] = [
    {
      name: 'tomé',
      Locales: '20',
    },
    {
      name: 'conception',
      Locales: '39',
    },
    {
      name: 'santiago',
      Locales: '25',
    },
    {
      name: 'valparaiso',
      Locales: '27',
    },
  ];

  heroImages = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1500&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1500&q=80'
  ];
  currentImage = 0;
  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.currentImage = (this.currentImage + 1) % this.heroImages.length;
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  constructor() {
    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : this.states.slice())),
    );
  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.name.toLowerCase().includes(filterValue));
  }
}