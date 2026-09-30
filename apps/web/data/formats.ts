import type { FormatSpec } from '@/types/frame';

export const PRINT_FORMATS: FormatSpec[] = [
  {
    id: 'A5',
    label: 'A5',
    widthCm: 14.8,
    heightCm: 21,
    widthPx: 148,
    heightPx: 210,
    priceBase: 15000,
  },
  {
    id: 'A4',
    label: 'A4',
    widthCm: 21,
    heightCm: 29.7,
    widthPx: 210,
    heightPx: 297,
    priceBase: 22000,
  },
  {
    id: 'A3',
    label: 'A3',
    widthCm: 29.7,
    heightCm: 42,
    widthPx: 297,
    heightPx: 420,
    priceBase: 35000,
  },
  {
    id: 'A2',
    label: 'A2',
    widthCm: 42,
    heightCm: 59.4,
    widthPx: 420,
    heightPx: 594,
    priceBase: 55000,
  },
];

export const getFormatById = (id: string): FormatSpec =>
  PRINT_FORMATS.find((f) => f.id === id) ?? PRINT_FORMATS[1];
