import { FSComponent, EventBus } from 'msfssdk';
import { AirspeedComponent, AirspeedEvents } from './b732-airspeed.component';

class Airspeed extends BaseInstrument {
    get templateID(): string {
        return 'b732-flight-airspeed';
    }

    private readonly eventBus = new EventBus();
    private displayType: string = 'knots';
    
    public connectedCallback(): void {
        super.connectedCallback();
        const baseUrl = this.getAttribute('Url');
        if (baseUrl) {
            const urlData = new URL(baseUrl);
            this.displayType = urlData.searchParams.get('displayType') || 'knots';
        } else {
            console.error('No baseUrl found, defaulting to knots display mode');
        }

        console.log(`Connecting ${this.templateID} as ${this.displayType}`);
        FSComponent.render(<AirspeedComponent bus={ this.eventBus } displayType={ this.displayType } />, document.getElementById('InstrumentContent'));
    }

    public Update(): void {
        
        const ias = SimVar.GetSimVarValue('AIRSPEED INDICATED', 'knots');
        const mach = SimVar.GetSimVarValue('AIRSPEED MACH', 'mach');
       
        this.eventBus.getPublisher<AirspeedEvents>().pub('ias', ias);
        this.eventBus.getPublisher<AirspeedEvents>().pub('mach', mach);
    }
}

registerInstrument('b732-flight-airspeed', Airspeed);
