import { FSComponent } from 'msfssdk';
import { EFBComponent } from './b732-efb.component';

class EFB extends BaseInstrument {
    get templateID(): string {
        return 'b732-efb';
    }
    
    public connectedCallback(): void {
        super.connectedCallback();
        console.log('Connected Callback: EFB', this);
        FSComponent.render(<EFBComponent />, document.getElementById('InstrumentContent'));
    }
}

registerInstrument('b732-efb', EFB);

