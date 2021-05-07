import React from 'react';
import * as S from './style';

const AuthInput = ({ value, type, placeholder, name, onChange }) => {
  return (
    <S.AuthInput
      defaultValue={value}
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
      autoComplete='new-password'
    />
  );
};

export default AuthInput;
