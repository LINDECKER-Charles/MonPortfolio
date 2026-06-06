import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Constellation } from './constellation';
import { ConstellationCategory, ConstellationItem } from './constellation.model';

const CATEGORIES: ConstellationCategory[] = [
  { id: 'a', label: 'Alpha', color: '#ff934d', glyph: '◆' },
  { id: 'b', label: 'Beta', color: '#8eb8ff', glyph: '✦' },
];

const ITEMS: ConstellationItem[] = [
  { id: 'one', title: 'One', category: 'a', tags: ['x', 'y'], chips: ['x'] },
  { id: 'two', title: 'Two', category: 'b', tags: ['y', 'z'] },
];

describe('Constellation', () => {
  let component: Constellation;
  let fixture: ComponentFixture<Constellation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [Constellation],
    }).compileComponents();

    fixture = TestBed.createComponent(Constellation);
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('categories', CATEGORIES);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links items sharing a tag', () => {
    // One et Two partagent le tag « y » → une arête.
    const svg = fixture.nativeElement.querySelectorAll('.constellation__edge');
    expect(svg.length).toBe(1);
  });

  it('renders an empty state with no items', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.constellation__empty')).toBeTruthy();
  });
});
