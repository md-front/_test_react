import { CalcCurrencyProps } from './Vacancy.types';

export const calcCurrency = ({ salary, type, usdCurrency }: CalcCurrencyProps) => (({ from, to, currency }) => {
  switch (type) {
    case currency:
      return { from, to };
    case 'USD':
      return { from: from / usdCurrency, to: to / usdCurrency };
    default:
      return { from: from * usdCurrency, to: to * usdCurrency };
  }
})(salary);
