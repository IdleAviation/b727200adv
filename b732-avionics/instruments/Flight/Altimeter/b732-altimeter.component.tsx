import { FSComponent, DisplayComponent, VNode, ComponentProps, EventBus, Subject } from 'msfssdk';
import './b732-altimeter.css';

export interface AltitudeEvents {
  altitude: number;
  inHg: number;
  mb: number;
}

interface AltimeterComponentProps extends ComponentProps {
  bus: EventBus;
  displayType: string | null;
}

export class AltimeterComponent extends DisplayComponent<AltimeterComponentProps> {

  public readonly indicatedAltitude: Subject<string>;
  public readonly mb: Subject<string>;
  public readonly inHg: Subject<string>;

  private displayType: string | null;

  constructor(props: AltimeterComponentProps) {
    super(props);

    const subscriber = props.bus.getSubscriber<AltitudeEvents>();

    this.displayType = props.displayType;
    this.indicatedAltitude = Subject.create<string>('0');
    this.mb = Subject.create<string>('1013')
    this.inHg = Subject.create<string>('29.92');

    subscriber.on('altitude').withPrecision(0).handle(this.setIndicatedAltitude);
    subscriber.on('mb').withPrecision(0).handle(this.setMb);
    subscriber.on('inHg').withPrecision(2).handle(this.setInHg);
  }

  private setIndicatedAltitude = (value: number): void => {
    this.indicatedAltitude.set(value.toString().padStart(5, '0'));
  }

  private setMb = (value: number): void => {
    this.mb.set(value.toString());
  }

  private setInHg = (value: number): void => {
    this.inHg.set(value.toFixed(2).toString());
  }

  private getRenderValue = (): string => {
    switch(this.displayType) {
      case 'altitude':
        return this.indicatedAltitude.toString();
        break;
      case 'mb':
        return this.mb.toString();
        break;
      case 'inHg':
        return this.inHg.toString();
        break;
      default: 
        return 'ERROR';
        break;
    }
  }

  public render(): VNode {
    return (
      <div class='altimeter-component'>{ this.getRenderValue() }</div>
    );
  }
}