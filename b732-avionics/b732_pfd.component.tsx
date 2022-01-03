import { FSComponent, DisplayComponent, VNode } from 'msfssdk';
import './b732_pfd.css';

export class B732PfdComponent extends DisplayComponent<any> {
  public render(): VNode {
    return (
      <div class='b732-pfd-component'>Hello World!</div>
    );
  }
}