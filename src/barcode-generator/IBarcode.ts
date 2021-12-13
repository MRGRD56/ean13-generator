export type BarcodeLine = 0 | 1;

interface IBarcode {
    readonly code: string;
    generateData(): BarcodeLine[];
    generateImage(): unknown;
}

export default IBarcode;