import { FSComponent, DisplayComponent, VNode, ComponentProps, EventBus, Subject } from 'msfssdk';
import { AltitudeEvents } from './altimeter.types';
import './b732-altimeter.css';

interface AltimeterComponentProps extends ComponentProps {
  bus: EventBus;
}

export class AltimeterComponent extends DisplayComponent<AltimeterComponentProps> {

  public readonly indicatedAltitude: Subject<string>;

  constructor(props: AltimeterComponentProps) {
    super(props);

    const subscriber = props.bus.getSubscriber<AltitudeEvents>();
    this.indicatedAltitude = Subject.create<string>('0');
    subscriber.on('altitude').withPrecision(0).handle(this.setIndicatedAltitude);
  }

  private setIndicatedAltitude = (value: number): void => {
    this.indicatedAltitude.set(value.toString().padStart(5, '0'));
  }

  public render(): VNode {
    return (
      <div class='altimeter-component'>{ this.indicatedAltitude }</div>
    );
  }
}