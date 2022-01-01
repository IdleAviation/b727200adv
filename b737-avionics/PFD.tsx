import { FSComponent } from 'msfssdk';
import { PFDComponent } from './PFDComponent';

class PFD extends BaseInstrument {
  get templateID(): string {
    return 'PFD';
  }

  public connectedCallback(): void {
    super.connectedCallback();
  
    FSComponent.render(<PFDComponent />, document.getElementById('InstrumentContent'));
  }
}

registerInstrument('pfd', PFD);