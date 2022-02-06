import { FSComponent, DisplayComponent, VNode, ComponentProps, EventBus, Subject } from 'msfssdk';
import './b732-airspeed.css';

export interface AirspeedEvents {
  ias: number;
  mach: number;
}

interface airspeedData {
  ias: Subject<string>;
  mach: Subject<string>;
}

interface AirspeedComponentProps extends ComponentProps {
  bus: EventBus;
  displayType: string;
}

export class AirspeedComponent extends DisplayComponent<AirspeedComponentProps> {

  public readonly airspeedData: airspeedData = {
    ias: Subject.create<string>('0'),
    mach: Subject.create<string>('MACH'),
  };

  private displayType: string = 'knots';

  constructor(props: AirspeedComponentProps) {
    super(props);

    const subscriber = props.bus.getSubscriber<AirspeedEvents>();

    this.displayType = props.displayType;

    subscriber.on('ias').withPrecision(0).handle(this.setIas);
    subscriber.on('mach').withPrecision(2).handle(this.setMach);
  }

  private setIas = (value: number): void => {
    console.log('setting airspeed: ', value);
    this.airspeedData.ias.set(value.toString());
  }

  private setMach = (value: number): void => {
    const machNumber = value * 100;
    machNumber > 0 && this.airspeedData.mach.set(machNumber.toString());
  }

  public render(): VNode {
    return (
      <div class='airspeed-component'
        data-type={ this.displayType }
        data-ias={ this.airspeedData.ias } 
        data-mach={ this.airspeedData.mach } 
      >
        { (this.airspeedData as any)[this.displayType] }
      </div>
    );
  }
}