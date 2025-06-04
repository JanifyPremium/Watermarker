import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-watermark',
  standalone: true,
  templateUrl: './watermark.html',
  styleUrls: ['./watermark.scss'],
  imports: [CommonModule, FormsModule]
})
export class WatermarkComponent {
  inputText = '';
  watermarkText = 'jana|blog|2025';
  encodedText = '';
  textToDecode = '';
  decodedText = '';

  // Zero-width characters als "Bits"
  private ZWSP = '\u200B'; // Zero Width Space, steht für "0"
  private ZWNJ = '\u200C'; // Zero Width Non-Joiner, steht für "1"
  private ZWJ  = '\u200D'; // Zero Width Joiner, als Separator zwischen Bytes

  /**
   * Wandelt Text in Zero-Width-Bits um, trennt Bytes mit ZWJ
   */
  private encodeWatermark(watermark: string): string {
    // Zeichen → Binärstrings (8 Bits pro Zeichen), dann mit ZWJ getrennt
    const bitStringWithSeparator = watermark
      .split('')
      .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(this.ZWJ);

    // Ersetze '0' mit ZWSP, '1' mit ZWNJ
    return bitStringWithSeparator
      .split(' ')
      .map(b => b === '0' ? this.ZWSP : this.ZWNJ)
      .join('');
  }

  /**
   * Fügt das codierte Wasserzeichen nach jeweils 10 Wörtern im Text ein
   */
  private embedWatermark(text: string, watermark: string): string {
    const encoded = this.encodeWatermark(watermark);
    const words = text.split(/\b/); // an Wortgrenzen splitten
    let result = '';
    let wordCount = 0;

    for (const word of words) {
      result += word;
      if (/\w/.test(word)) wordCount++;
      if (wordCount > 0 && wordCount % 10 === 0) {
        result += encoded;
      }
    }

    return result;
  }

  /**
   * Encoder-Funktion für Button-Klick
   */
  encode() {
    this.encodedText = this.embedWatermark(this.inputText, this.watermarkText);
    this.textToDecode = this.encodedText; // Automatisch für Decoder vorbereiten
    this.decodedText = ''; // Reset vorherige Ausgabe
  }

  /**
   * Decoder-Funktion für Button-Klick
   */
  decode() {
    // Filtere nur Zero-Width-Zeichen heraus
    const zeroWidthOnly = [...this.textToDecode]
      .filter(c => c === this.ZWSP || c === this.ZWNJ || c === this.ZWJ)
      .map(c => {
        if (c === this.ZWSP) return '0';
        if (c === this.ZWNJ) return '1';
        if (c === this.ZWJ) return '|'; // Separator als |
        return '';
      })
      .join('');

    console.log('Gefilterte Zero-Width-Zeichen als Bits:', zeroWidthOnly.replace(/\|/g, ' | '));

    if (!zeroWidthOnly.includes('0') && !zeroWidthOnly.includes('1')) {
      this.decodedText = '(Kein Wasserzeichen gefunden)';
      return;
    }

    // Bytes extrahieren und in Zahlen umwandeln
    const bytes = zeroWidthOnly
      .split(' ')
      .filter(b => b.length === 8) // nur gültige Bytes mit 8 Bits verwenden
      .map(b => parseInt(b, 2));

    console.log('Bytes nach parseInt:', bytes);

    // Bytes zu Text konvertieren, NaN ausfiltern
    this.decodedText = String.fromCharCode(...bytes.filter(n => !isNaN(n)));
  }
}