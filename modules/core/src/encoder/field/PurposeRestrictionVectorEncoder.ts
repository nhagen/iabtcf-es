import { IntEncoder } from './IntEncoder';
import { BooleanEncoder } from './BooleanEncoder';
import { BitLength } from '../BitLength';
import { PurposeRestrictionVector, PurposeRestriction } from '../../model';

export class PurposeRestrictionVectorEncoder {
  public static encode(prVector: PurposeRestrictionVector): string {
    // start with the number of restrictions
    let bitString = IntEncoder.encode(
      prVector.numRestrictions,
      BitLength.numRestrictions
    );

    // if the vector is empty we'll just return a string with just the numRestricitons being 0
    if (!prVector.isEncodable()) {
      // create each restriction group
      prVector
        .getRestrictions()
        .forEach((purpRestriction: PurposeRestriction): void => {
          // every restriction group has the purposeId and the restrictionType;
          bitString += IntEncoder.encode(
            purpRestriction.purposeId,
            BitLength.purposeId
          );
          bitString += IntEncoder.encode(
            purpRestriction.restrictionType,
            BitLength.restrictionType
          );

          // now get all the vendors under that restriction
          const vendors: number[] = prVector.getVendors(purpRestriction);
          const len: number = vendors.length;

          /**
           * numEntries comes first so we will have to keep a counter and the do
           * the encoding at the end
           */
          let numEntries = 0;
          let startId = 0;
          let rangeField = '';

          for (let i = 0; i < len; i++) {
            const vendorId: number = vendors[i];

            if (startId === 0) {
              numEntries++;
              startId = vendorId;
            }

            // either end of the loop or there's a gap greater than 1 number
            if (i === len - 1 || vendors[i + 1] > vendorId + 1) {
              /**
               * it's a range entry if we've got something other than the start
               * ID
               */
              const isRange = !(vendorId === startId);

              // 0 means single 1 means range
              rangeField += BooleanEncoder.encode(isRange);
              rangeField += IntEncoder.encode(startId, BitLength.vendorId);

              if (isRange) {
                rangeField += IntEncoder.encode(vendorId, BitLength.vendorId);
              }

              // reset the startId so we grab the next id in the list
              startId = 0;
            }
          }

          /**
           * now that  the range encoding is built, encode the number of ranges
           * and then append the range field to the bitString.
           */
          bitString += IntEncoder.encode(numEntries, BitLength.numEntries);
          bitString += rangeField;
        });
    }

    return bitString;
  }

  public static decode(encodedString: string): PurposeRestrictionVector {
    let index = 0;
    const vector: PurposeRestrictionVector = new PurposeRestrictionVector();
    const numRestrictions: number = IntEncoder.decode(
      encodedString.substr(index, BitLength.numRestrictions)
    );
    index += BitLength.numRestrictions;

    for (let i = 0; i < numRestrictions; i++) {
      // First is purpose ID
      const purposeId = IntEncoder.decode(
        encodedString.substr(index, BitLength.purposeId)
      );
      index += BitLength.purposeId;
      // Second Restriction Type
      const restrictionType = IntEncoder.decode(
        encodedString.substr(index, BitLength.restrictionType)
      );
      index += BitLength.restrictionType;

      const purposeRestriction: PurposeRestriction = new PurposeRestriction(
        purposeId,
        restrictionType
      );
      // Num Entries (number of vendors)
      const numEntries: number = IntEncoder.decode(
        encodedString.substr(index, BitLength.numEntries)
      );
      index += BitLength.numEntries;

      for (let j = 0; j < numEntries; j++) {
        const isARange: boolean = BooleanEncoder.decode(
          encodedString.substr(index, BitLength.anyBoolean)
        );
        index += BitLength.anyBoolean;

        const startOrOnlyVendorId: number = IntEncoder.decode(
          encodedString.substr(index, BitLength.vendorId)
        );
        index += BitLength.vendorId;

        if (isARange) {
          const endVendorId: number = IntEncoder.decode(
            encodedString.substr(index, BitLength.vendorId)
          );
          index += BitLength.vendorId;

          for (
            let k: number = startOrOnlyVendorId;
            k < startOrOnlyVendorId + endVendorId;
            k++
          ) {
            vector.add(k, purposeRestriction);
          }
        } else {
          vector.add(startOrOnlyVendorId, purposeRestriction);
        }
      }
    }

    vector.bitLength = index;

    return vector;
  }
}
