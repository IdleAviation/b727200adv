import { FSComponent, DisplayComponent, VNode, ComponentProps, EventBus, Subject } from 'msfssdk';
import { AltitudeEvents } from './altimeter.types';
import './b732-altimeter.css';

interface AltimeterMBComponentProps extends ComponentProps {
  bus: EventBus;
}

export class AltimeterMBComponent extends DisplayComponent<AltimeterMBComponentProps> {

  public readonly mb: Subject<string>;

  constructor(props: AltimeterMBComponentProps) {
    super(props);

    const subscriber = props.bus.getSubscriber<AltitudeEvents>();
    this.mb = Subject.create<string>('0');
    subscriber.on('mb').withPrecision(0).handle(this.setMb);
  }

  private setMb = (value: number): void => {
    this.mb.set(value.toString().padStart(4, '0'));
  }

  public render(): VNode {
    return (
      <div class='altimeter-component'>{ this.mb }</div>
    );
  }
}