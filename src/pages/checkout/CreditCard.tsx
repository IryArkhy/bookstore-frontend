import React from 'react';
import Cards from 'react-credit-cards-2';

type Props = {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  focused?: 'number' | 'name' | 'expiry' | 'cvc';
};

export const CreditCard: React.FC<Props> = ({
  name = '',
  number = '',
  cvc = '',
  expiry = '',
  focused = undefined,
}) => {
  return <Cards name={name} number={number} cvc={cvc} expiry={expiry} focused={focused} />;
};
