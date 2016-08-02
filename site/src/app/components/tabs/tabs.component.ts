import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { Tab } from '../tab';

@Component({
  selector: 'tabs',
  template:`
  <div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
    <div class="mdl-tabs__tab-bar">
      <span *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.is-active]="tab.active" class="mdl-tabs__tab">
        {{tab.title}}
      </span>
    </div>
    <ng-content></ng-content>
  `
})
export class Tabs implements AfterContentInit {

  @ContentChildren(Tab) tabs: QueryList<Tab>;

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab)=>tab.active);

    // if there is no active tab set, activate the first
    if(activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: Tab){
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);

    // activate the tab the user has clicked on.
    tab.active = true;
  }

}
