export interface IsoCurrency {
  CtryNm: string;
  CcyNm: string | { _IsFund: string; __text: string };
  Ccy?: string;
  CcyNbr?: string;
  CcyMnrUnts?: string;
}
