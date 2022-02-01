import { FSComponent, DisplayComponent, VNode, ComponentProps, EventBus, Subject } from 'msfssdk';
import './b732-altimeter.css';

export interface AltitudeEvents {
  altitude: number;
  inHg: number;
  mb: number;
}

interface altimeterData {
  altitude: Subject<string>;
  inhg: Subject<string>;
  mb: Subject<string>;
}

interface AltimeterComponentProps extends ComponentProps {
  bus: EventBus;
  displayType: string;
}

export class AltimeterComponent extends DisplayComponent<AltimeterComponentProps> {

  public readonly altimeterData: altimeterData = {
    altitude: Subject.create<string>('0'),
    inhg: Subject.create<string>('29.92'),
    mb: Subject.create<string>('1013'),
  };

  private displayType: string = 'altitude';

  constructor(props: AltimeterComponentProps) {
    super(props);

    const subscriber = props.bus.getSubscriber<AltitudeEvents>();

    this.displayType = props.displayType;

    subscriber.on('altitude').withPrecision(0).handle(this.setIndicatedAltitude);
    subscriber.on('mb').withPrecision(0).handle(this.setMb);
    subscriber.on('inHg').withPrecision(2).handle(this.setInHg);
  }

  private setIndicatedAltitude = (value: number): void => {
    const absValue = Math.abs(value);
    const displayValue = value > 0
      ? value.toString().padStart(5, '0')
      : `-${ absValue.toString().padStart(5, '0') }`;
      
    this.altimeterData.altitude.set(displayValue);
  }

  private setMb = (value: number): void => {
    this.altimeterData.mb.set(value.toString());
  }

  private setInHg = (value: number): void => {
    this.altimeterData.inhg.set(value.toFixed(2).toString());
  }

  public render(): VNode {
    return (
      <div class='altimeter-component'
        data-altitude={ this.altimeterData.altitude } 
        data-mb={ this.altimeterData.mb } 
        data-inhg={ this.altimeterData.inhg }
      >
        { (this.altimeterData as any)[this.displayType] }
      </div>
    );
  }
}