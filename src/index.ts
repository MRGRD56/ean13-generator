import Ean13Barcode from "./barcode-generator/ean13/Ean13Barcode";
import IBarcode from "./barcode-generator/IBarcode";

const barcode: IBarcode = new Ean13Barcode('8711253001202');
const data = barcode.generateData();
console.log(data);