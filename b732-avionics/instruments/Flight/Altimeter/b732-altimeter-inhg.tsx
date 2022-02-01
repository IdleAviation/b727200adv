import { FSComponent, Subject, EventBus } from 'msfssdk';
import { AltimeterInHgComponent } from './b732-altimeter-inhg.component';
import { AltitudeEvents } from './altimeter.types';

class AltimeterInHg extends BaseInstrument {
    get templateID(): string {
        return 'b732-flight-altimeter-inhg';
    }

    private readonly eventBus = new EventBus();
    
    public connectedCallback(): void {
        super.connectedCallback();
        FSComponent.render(<AltimeterInHgComponent bus={ this.eventBus } />, document.getElementById('InstrumentContent'));
    }

    public Update(): void {
        const inhg = SimVar.GetSimVarValue('KOHLSMAN SETTING HG:1', 'inhg');
        this.eventBus.getPublisher<AltitudeEvents>().pub('inHg', inhg);
    }
}

registerInstrument('b732-flight-altimeter-inhg', AltimeterInHg);

