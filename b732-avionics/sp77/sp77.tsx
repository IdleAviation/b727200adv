import { FSComponent, EventBus } from 'msfssdk';
import { SP77Component, AutopilotEvents } from './sp77.component';

class SP77 extends BaseInstrument {
    get templateID(): string {
        return 'b732-sp77';
    }

    private readonly eventBus = new EventBus();
    private displayType: string = 'heading';
    
    public connectedCallback(): void {
        super.connectedCallback();
        const baseUrl = this.getAttribute('Url');
        if (baseUrl) {
            const urlData = new URL(baseUrl);
            this.displayType = urlData.searchParams.get('displayType') || 'heading';
        } else {
            console.error('No baseUrl found, defaulting to heading display mode');
        }

        console.log(`Connecting ${this.templateID} as ${this.displayType}`);
        FSComponent.render(<SP77Component bus={ this.eventBus } displayType={ this.displayType } />, document.getElementById('InstrumentContent'));
    }

    public Update(): void {
        
        const apHeading = SimVar.GetSimVarValue('AUTOPILOT HEADING LOCK DIR	', 'degrees');
        this.eventBus.getPublisher<AutopilotEvents>().pub('heading', apHeading);
    }
}

registerInstrument('b732-sp77', SP77);

