import Ean13Barcode from "./barcode-generator/ean13/Ean13Barcode";
import * as fs from "fs";

const barcode = new Ean13Barcode('8711253001202');
const image = barcode.generateImage();

if (!fs.existsSync('./out')) {
    fs.mkdirSync('./out');
}
fs.writeFileSync('./out/barcode.svg', image);