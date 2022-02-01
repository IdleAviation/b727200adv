import { FSComponent, Subject, EventBus } from 'msfssdk';
import { AltimeterComponent, AltitudeEvents } from './b732-altimeter.component';
class Altimeter extends BaseInstrument {
    get templateID(): string {
        return 'b732-flight-altimeter';
    }

    private readonly eventBus = new EventBus();
    private readonly displayType: string | null = 'altitude';

    constructor() {
        super();
        const queryParams = new URLSearchParams(window.location.search)
        this.displayType = queryParams.get('displayType')
    }
    
    public connectedCallback(): void {
        super.connectedCallback();
        FSComponent.render(<AltimeterComponent bus={ this.eventBus } displayType={ this.displayType } />, document.getElementById('InstrumentContent'));
    }

    public Update(): void {
        const indicatedAltitude = SimVar.GetSimVarValue('INDICATED ALTITUDE', 'feet');
        const mb = SimVar.GetSimVarValue('KOHLSMAN SETTING MB:1', 'millibars');
        const inhg = SimVar.GetSimVarValue('KOHLSMAN SETTING HG:1', 'inhg');
        
        this.eventBus.getPublisher<AltitudeEvents>().pub('altitude', indicatedAltitude);
        this.eventBus.getPublisher<AltitudeEvents>().pub('mb', mb);
        this.eventBus.getPublisher<AltitudeEvents>().pub('inHg', inhg);
    }
}

registerInstrument('b732-flight-altimeter', Altimeter);

