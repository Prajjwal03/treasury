import {
  Component, AfterContentInit, ContentChildren,
  QueryList, ViewChild, ComponentFactoryResolver, ViewEncapsulation, Input, Output, EventEmitter
} from '@angular/core';
import {TabComponent} from '../tab/tab.component';
import {DynamicTabsDirective} from '../dynamic-tabs.directive';

@Component({
  selector: 'app-dashboard-tabs',
  templateUrl: './dashboard-tabs.component.html',
  styleUrls: ['./dashboard-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardTabsComponent implements AfterContentInit {

  @Input() activeTab: string;
  @Output() activeTabChanged = new EventEmitter();

  dynamicTabs: TabComponent[] = [];

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  @ViewChild(DynamicTabsDirective, {static: false}) dynamicTabPlaceholder: DynamicTabsDirective;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter(tab => tab.active);

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }

  }

  openTabBC(title: string, template, isCloseable = false) {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      TabComponent
    );
    const viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const instance: TabComponent = componentRef.instance;
    instance.title = title;
    instance.template = template;
    instance.isCloseable = isCloseable;

    this.dynamicTabs.push(componentRef.instance);
    this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
  }

  openTab(title: string, template, data, isCloseable = false) {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      TabComponent
    );
    const viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const instance: TabComponent = componentRef.instance;
    instance.title = title;
    instance.template = template;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;

    this.dynamicTabs.push(componentRef.instance);
    this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
  }

  selectTab(tab: TabComponent) {
    console.log(tab);
    this.tabs.toArray().forEach(tab => (tab.active = false));
    this.dynamicTabs.forEach(tab => (tab.active = false));

    tab.active = true;
    this.activeTab = tab.title;
    this.activeTabChanged.emit(this.activeTab);
  }

  closeTab(tab: TabComponent) {
    for (let i = 0; i < this.dynamicTabs.length; i++) {
      if (this.dynamicTabs[i] === tab) {
        this.dynamicTabs.splice(i, 1);
        let viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
        viewContainerRef.remove(i);
        this.selectTab(this.tabs.first);
        break;
      }
    }
  }

  closeActiveTab() {
    console.log('trigger inside cloase')
    const activeTabs = this.dynamicTabs.filter(tab => tab.active);
    if (activeTabs.length > 0) {
      this.closeTab(activeTabs[0]);
    }
  }
}
