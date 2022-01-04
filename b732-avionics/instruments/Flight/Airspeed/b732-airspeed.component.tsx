import { FSComponent, DisplayComponent, VNode } from 'msfssdk';
import './b732-airspeed.css';

export class AirspeedComponent extends DisplayComponent<any> {
  public render(): VNode {
    return (
      <div class='airspeed-component'>Hello World!</div>
    );
  }
}