import QRCode from 'qrcode';

export async function toQRCodeDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, {
    margin: 2,
    width: 360
  });
}
