import { useEffect, useState } from "react";
import QRCode from "qrcode";

/** QR code généré localement (aucun service externe). */
export const QrCode = ({
  value,
  size = 160,
  fg = "#46121F",
  bg = "#F4F0E7",
}: {
  value: string;
  size?: number;
  fg?: string;
  bg?: string;
}) => {
  const [svg, setSvg] = useState<string>("");
  useEffect(() => {
    let cancelled = false;
    QRCode.toString(value, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: fg, light: bg } })
      .then((s) => !cancelled && setSvg(s))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [value, fg, bg]);
  return (
    <div
      aria-label={`QR code : ${value}`}
      style={{ width: size, height: size, lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: svg.replace("<svg ", `<svg width="${size}" height="${size}" `) }}
    />
  );
};
