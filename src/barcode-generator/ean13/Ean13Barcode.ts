import IBarcode, {BarcodeLine} from "../IBarcode";
import * as codingData from './data/coding.json';
import * as firstFigureData from './data/firstFigure.json';
import {createCanvas} from "canvas";
import _ from "lodash";

class Ean13Barcode implements IBarcode {
    private generatedData?: BarcodeLine[];

    constructor(public readonly code: string) {
        if (!/^[0-9]{13}$/.test(code)) {
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
            .slice(1, 13)
            .map((value, index) => Ean13Barcode.getNumberCode(value, coding[index]));

        this.generatedData = data;
        return data;
    }

    generateImage(showCode: boolean = true): Buffer {
        const data = this.generateData();

        const canvas = createCanvas(220, 130, "svg");
        const canvasContext = canvas.getContext("2d");

        const drawBarcode = () => {
            canvasContext.fillStyle = '#ffffff';
            canvasContext.fillRect(0, 0, canvas.width, canvas.height);

            canvasContext.fillStyle = '#000000';

            const pixelSize = 2;
            const normalLineHeight = 46 * pixelSize;
            const longLineHeight = 52 * pixelSize;
            const marginTop = 4 * pixelSize;
            let x = 8 * pixelSize;

            const drawLine = (isBlack: boolean, isLong: boolean) => {
                const lineHeight = isLong ? longLineHeight : normalLineHeight;
                if (isBlack) {
                    canvasContext.fillRect(x, marginTop, pixelSize, lineHeight);
                }
                x += pixelSize;
            };

            const drawLineByCode = (letter: '0' | '1' | 'L') => {
                switch (letter) {
                    case "0":
                        drawLine(false, false);
                        break;
                    case "1":
                        drawLine(true, false);
                        break;
                    case "L":
                        drawLine(true, true);
                        break;
                }
            };

            const lineCodes = 'L0L' + data.slice(0, 6).join('') + '0L0L0' + data.slice(6, 12).join('') + 'L0L';
            _(lineCodes).forEach(drawLineByCode);

            const drawCodeText = () => {
                const code = this.code;

                let x = 4 * pixelSize;
                const y = marginTop + normalLineHeight + 8 * pixelSize;
                const step = 7 * pixelSize;

                canvasContext.textAlign = 'center';
                canvasContext.fillStyle = '#000000';
                canvasContext.textDrawingMode = "path";
                canvasContext.font = '18px Arial';

                canvasContext.fillText(code[0], x, y);

                x += 11 * pixelSize;

                const drawCodePart = (part: string) => {
                    _(part).forEach(char => {
                        canvasContext.fillText(char, x, y);
                        x += step;
                    });
                };

                drawCodePart(code.slice(1, 7));

                x += 4 * pixelSize;

                drawCodePart(code.slice(7, 13));
            };

            if (showCode) {
                drawCodeText();
            }
        };

        drawBarcode();

        return canvas.toBuffer();
    }
}

export default Ean13Barcode;