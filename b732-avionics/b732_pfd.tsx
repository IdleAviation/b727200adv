import { FSComponent } from 'msfssdk';
import { B732PfdComponent } from './b732_pfd.component';

class B737200PFD extends BaseInstrument {
  get templateID(): string {
    return 'b732-pfd';
  }

  public connectedCallback(): void {
    super.connectedCallback();
  
    FSComponent.render(<B732PfdComponent />, document.getElementById('InstrumentContent'));
  }
}

registerInstrument('b732-pfd', B737200PFD);