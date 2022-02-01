import { FSComponent, Subject, EventBus } from 'msfssdk';
import { AltimeterMBComponent } from './b732-altimeter-mb.component';
import { AltitudeEvents } from './altimeter.types';

class AltimeterMB extends BaseInstrument {
    get templateID(): string {
        return 'b732-flight-altimeter-mb';
    }

    private readonly eventBus = new EventBus();
    
    public connectedCallback(): void {
        super.connectedCallback();
        FSComponent.render(<AltimeterMBComponent bus={ this.eventBus } />, document.getElementById('InstrumentContent'));
    }

    public Update(): void {
        const mb = SimVar.GetSimVarValue('KOHLSMAN SETTING MB:1', 'millibars');
        this.eventBus.getPublisher<AltitudeEvents>().pub('mb', mb);
    }
}

registerInstrument('b732-flight-altimeter-mb', AltimeterMB);

