import { FSComponent } from 'msfssdk';
import { AltimeterComponent } from './b732-altimeter.component';

class Altimeter extends BaseInstrument {
    get templateID(): string {
        return 'b732-flight-altimeter';
    }
    
    public connectedCallback(): void {
        super.connectedCallback();
        FSComponent.render(<AltimeterComponent />, document.getElementById('InstrumentContent'));
    }
}

registerInstrument('b732-flight-altimeter', Altimeter);

