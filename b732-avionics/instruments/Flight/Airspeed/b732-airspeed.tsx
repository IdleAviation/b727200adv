import { FSComponent } from 'msfssdk';
import { AirspeedComponent } from './b732-airspeed.component';

class Airspeed extends BaseInstrument {
    get templateID(): string {
        return 'b732-flight-airspeed';
    }
    
    public connectedCallback(): void {
        super.connectedCallback();
        FSComponent.render(<AirspeedComponent />, document.getElementById('InstrumentContent'));
    }
}

registerInstrument('b732-flight-airspeed', Airspeed);

