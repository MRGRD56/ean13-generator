import IBarcode, {BarcodeLine} from "../IBarcode";
import * as codingData from './data/coding.json';
import * as firstFigureData from './data/firstFigure.json';
import * as _ from "lodash";

class Ean13Barcode implements IBarcode {
    private generatedData?: BarcodeLine[];

    constructor(public readonly code: string) {
        if (code.length !== 13) {
            throw new Error('code length must be 13');
        }

        if (!/^[0-9]$/.test(code)) {
            throw new Error('code is invalid');
        }
    }

    private static getNumberCode(number: string, type: string) {
        return codingData[number][type];
    }

    generateData(): BarcodeLine[] {
        if (this.generatedData) {
            return this.generatedData;
        }

        const coding = firstFigureData[this.code[0]] + 'RRRRRR';
        const data: BarcodeLine[] = Array.from(this.code)
            .slice(1, 12)
            .map((value, index) => Ean13Barcode.getNumberCode(value, coding[index - 1]));

        this.generatedData = data;
        return data;
    }

    generateImage(): unknown {
        return undefined;
    }
}

export default Ean13Barcode;