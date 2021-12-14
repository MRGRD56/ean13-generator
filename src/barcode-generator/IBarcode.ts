export type BarcodeLine = 0 | 1;

interface IBarcode {
    readonly code: string;
    generateData(): BarcodeLine[];
    generateImage(showCode: boolean): Buffer;
}

export default IBarcode;