import { FSComponent, EventBus } from 'msfssdk';
import { AltimeterComponent, AltitudeEvents } from './b732-altimeter.component';

class Altimeter extends BaseInstrument {
    get templateID(): string {
        return 'b732-flight-altimeter';
    }

    private readonly eventBus = new EventBus();
    private displayType: string = 'altitude';
    
    public connectedCallback(): void {
        super.connectedCallback();
        const baseUrl = this.getAttribute('Url');
        if (baseUrl) {
            const urlData = new URL(baseUrl);
            this.displayType = urlData.searchParams.get('displayType') || 'altitude';
        } else {
            console.error('No baseUrl found, defaulting to altitude display mode');
        }

        console.log(`Connecting ${this.templateID} as ${this.displayType}`);
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

