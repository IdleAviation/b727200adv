import { FSComponent, DisplayComponent, VNode } from 'msfssdk';
import './b732-altimeter.css';

export class AltimeterComponent extends DisplayComponent<any> {
  public render(): VNode {
    return (
      <div class='altimeter-component'>Hello World!</div>
    );
  }
}