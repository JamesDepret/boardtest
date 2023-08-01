import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDropList,
  DragRef,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ViewChild } from '@angular/core';

interface Item {
  id: number;
  name: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(CdkDropList) placeholder: CdkDropList | null = null;

  private target: CdkDropList | null = null;
  private targetIndex: number = -1;
  private source: CdkDropList | null = null;
  private sourceIndex: number = -1;
  private dragRef: DragRef | null = null;
  private parentContainerElement: HTMLElement | null = null;
  private sameParent: boolean = false;

  items1: Array<Item> = [{ id: 1, name: "1" }, { id: 2, name: "2" }, { id: 3, name: "3" }, { id: 4, name: "4" }, { id: 5, name: "5" }, { id: 6, name: "6" }, { id: 7, name: "7" }, { id: 8, name: "8" }, { id: 9, name: "9" }]
  items2: Array<Item> = [{ id: 11, name: "11" }, { id: 12, name: "12" }, { id: 13, name: "13" }, { id: 14, name: "14" }, { id: 15, name: "15" }, { id: 16, name: "16" }, { id: 17, name: "17" }, { id: 18, name: "18" }, { id: 19, name: "19" }]
  items3: Array<Item> = [{ id: 21, name: "21" }, { id: 22, name: "22" }, { id: 23, name: "23" }, { id: 24, name: "24" }, { id: 25, name: "25" }, { id: 26, name: "26" }, { id: 27, name: "27" }, { id: 28, name: "28" }, { id: 29, name: "29" }]
  currentItem: Item | null = null;
  itemsDictionary: { [id: string]: Item[]; } = {};

  boxWidth = '150px';
  boxHeight = '60px';

  ngAfterViewInit() {
    if (this.placeholder == null) return;
    const placeholderElement = this.placeholder!.element.nativeElement;

    placeholderElement.style.display = 'none';
    placeholderElement.parentNode!.removeChild(placeholderElement);

    this.itemsDictionary["project_1"] = this.items1;
    this.itemsDictionary["project_2"] = this.items2;
    this.itemsDictionary["project_3"] = this.items3;
  }

  onDragStarted(event: any, item: Item) {
    this.parentContainerElement = event.source.dropContainer.element.nativeElement.parentElement;
    this.currentItem = item;
  }

  onDropListDropped(event: CdkDragDrop<number[]>) {
    if (!this.target) return;
    const placeholderElement: HTMLElement = this.placeholder!.element.nativeElement; //
    const placeholderParentElement: HTMLElement = placeholderElement.parentElement!; // div.resource-container
    const fromContainerId = this.parentContainerElement!.id;
    let fromItemsArray = this.itemsDictionary[fromContainerId];
    if (this.sameParent == false) {
      let index = fromItemsArray.indexOf(this.currentItem!);
      fromItemsArray.splice(index, 1);

      let toConntainerId = placeholderParentElement.id;
      let toItemsArray = this.itemsDictionary[toConntainerId];
      toItemsArray.splice(this.targetIndex, 0, this.currentItem!);
    }

    placeholderElement.style.display = 'none';

    placeholderParentElement.removeChild(placeholderElement);
    placeholderParentElement.appendChild(placeholderElement);

    if (this.sameParent) {
      placeholderParentElement.insertBefore(
        this.source!.element.nativeElement,
        placeholderParentElement.children[this.sourceIndex]
      );
    }
    else {
      placeholderParentElement.insertBefore(
        this.source!.element.nativeElement,
        placeholderParentElement.children[this.targetIndex]
      );
    }

    if (this.placeholder!._dropListRef.isDragging()) {
      this.placeholder!._dropListRef.exit(this.dragRef!);
    }

    this.target = null;
    this.source = null;
    this.dragRef = null;

    if (this.sameParent == false) return;
    if (this.sourceIndex !== this.targetIndex) {
      moveItemInArray(fromItemsArray, this.sourceIndex, this.targetIndex);
    }
  }

  onDropListEntered({ item, container }: CdkDragEnter) {
    if (container == this.placeholder) return;
    const sourceElement: HTMLElement = item.dropContainer.element.nativeElement;
    const dropParentElement: HTMLElement = container.element.nativeElement.parentElement!;
    this.sameParent = this.parentContainerElement == dropParentElement;

    const placeholderElement: HTMLElement = this.placeholder!.element.nativeElement;
    const dropElement: HTMLElement = container.element.nativeElement;
    const dragIndex: number = Array.prototype.indexOf.call(
      dropElement.parentElement!.children,
      this.source ? placeholderElement : sourceElement
    );
    const dropIndex: number = Array.prototype.indexOf.call(
      dropElement.parentElement!.children,
      dropElement
    );

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = item.dropContainer;

      placeholderElement.style.width = this.boxWidth + 'px';
      placeholderElement.style.height = this.boxHeight + 40 + 'px';

      sourceElement.parentElement!.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = container;
    this.dragRef = item._dragRef;

    placeholderElement.style.display = '';

    dropElement.parentElement!.insertBefore(
      placeholderElement,
      dropIndex > dragIndex ? dropElement.nextSibling : dropElement
    );

    this.placeholder!._dropListRef.enter(
      item._dragRef,
      item.element.nativeElement.offsetLeft,
      item.element.nativeElement.offsetTop
    );
  }
}
