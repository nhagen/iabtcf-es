import {Ping} from '../../model';
import {CmpStatus, DisplayStatus} from '../../status';
import {ResponseBuilder} from './ResponseBuilder';

/**
 * Ping response builder
 */
export class PingBldr extends ResponseBuilder implements Ping {

  /**
   * true - CMP main script is loaded
   * false - still running stub
   */
  public cmpLoaded: boolean;

  /**
   * see Ping Status Codes in following table
   */
  public cmpStatus: CmpStatus;

  /**
   * see Ping Status Codes in following table
   */
  public displayStatus: DisplayStatus;

  /**
   * version of the CMP API that is supported; e.g. “2”
   */
  public apiVersion: string;

  /**
   * Version of the GVL currently loaded by the CMP
   * undefined if still the stub
   */
  public gvlVersion: number;

}