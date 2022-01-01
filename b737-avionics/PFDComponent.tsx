import { FSComponent, DisplayComponent, VNode } from 'msfssdk';
import './PFD.css';

export class PFDComponent extends DisplayComponent<any> {
  public render(): VNode {
    return (
      <div class='pfd-component'>Hello World!</div>
    );
  }
}