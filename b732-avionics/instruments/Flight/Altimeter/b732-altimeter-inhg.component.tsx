import { FSComponent, DisplayComponent, VNode, ComponentProps, EventBus, Subject } from 'msfssdk';
import { AltitudeEvents } from './altimeter.types';
import './b732-altimeter.css';

interface AltimeterInHgComponentProps extends ComponentProps {
  bus: EventBus;
}

export class AltimeterInHgComponent extends DisplayComponent<AltimeterInHgComponentProps> {

  public readonly inhg: Subject<string>;

  constructor(props: AltimeterInHgComponentProps) {
    super(props);

    const subscriber = props.bus.getSubscriber<AltitudeEvents>();
    this.inhg = Subject.create<string>('0');
    subscriber.on('inHg').withPrecision(2).handle(this.setInHg);
  }

  private setInHg = (value: number): void => {
    this.inhg.set(value.toString().padEnd(5, '0'));
  }

  public render(): VNode {
    return (
      <div class='altimeter-component'>{ this.inhg }</div>
    );
  }
}