import { FSComponent, DisplayComponent, VNode, ComponentProps, EventBus, Subject } from 'msfssdk';
import './sp77.css';

export interface AutopilotEvents {
  heading: number;
}

interface autopilotData {
  heading: Subject<string>;
}

interface SP77ComponentProps extends ComponentProps {
  bus: EventBus;
  displayType: string;
}

export class SP77Component extends DisplayComponent<SP77ComponentProps> {

  public readonly autopilotData: autopilotData = {
    heading: Subject.create<string>('0'),
  };

  private displayType: string = 'heading';

  constructor(props: SP77ComponentProps) {
    super(props);

    const subscriber = props.bus.getSubscriber<AutopilotEvents>();

    this.displayType = props.displayType;

    subscriber.on('heading').withPrecision(0).handle(this.setHeading);
  }

  private setHeading = (value: number): void => {    
    this.autopilotData.heading.set(value.toString().padStart(3, '0'));
  }

  public render(): VNode {
    return (
      <div class='sp77-component'
        data-type={ this.displayType }
        data-heading={ this.autopilotData.heading } 
      >
        { (this.autopilotData as any)[this.displayType] }
      </div>
    );
  }
}