import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Generates a base64 Data URL for a given URL or text
 */
export async function generateQRCodeDataUrl(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: options.width || 300,
      margin: options.margin || 2,
      color: {
        dark: options.color?.dark || '#881337', // Royal maroon
        light: options.color?.light || '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
}

