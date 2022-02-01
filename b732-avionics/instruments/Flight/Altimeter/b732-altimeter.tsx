import { FSComponent, Subject, EventBus } from 'msfssdk';
import { AltimeterComponent } from './b732-altimeter.component';
import { AltitudeEvents } from './altimeter.types';

class Altimeter extends BaseInstrument {
    get templateID(): string {
        return 'b732-flight-altimeter';
    }

    private readonly eventBus = new EventBus();
    
    public connectedCallback(): void {
        super.connectedCallback();
        FSComponent.render(<AltimeterComponent bus={ this.eventBus } />, document.getElementById('InstrumentContent'));
    }

    public Update(): void {
        const indicatedAltitude = SimVar.GetSimVarValue('INDICATED ALTITUDE', 'feet');
        this.eventBus.getPublisher<AltitudeEvents>().pub('altitude', indicatedAltitude);
    }
}

registerInstrument('b732-flight-altimeter', Altimeter);

