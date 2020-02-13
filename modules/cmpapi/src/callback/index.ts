export * from './ErrorCallback';
export * from './FailCallback';
export * from './InAppTCDataCallback';
export * from './PingCallback';
export * from './RemoveListenerCallback';
export * from './TCDataCallback';
export * from './VendorListCallback';

import { InAppTCDataCallback } from './InAppTCDataCallback';
import { PingCallback } from './PingCallback';
import { RemoveListenerCallback } from './RemoveListenerCallback';
import { TCDataCallback } from './TCDataCallback';
import { VendorListCallback } from './VendorListCallback';
import { ErrorCallback } from './ErrorCallback';
import { FailCallback } from './FailCallback';

/**
 * Union type of all command callback function signatures
 */
export type Callback =
  | TCDataCallback
  | InAppTCDataCallback
  | PingCallback
  | VendorListCallback
  | RemoveListenerCallback
  | ErrorCallback
  | FailCallback;
