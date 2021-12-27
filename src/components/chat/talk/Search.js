import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoCloseOutline } from 'react-icons/io5';

const SearchBox = styled.div`
  position: relative;
  padding: 12px 20px;
  .sch_icon {
    position: absolute;
    font-size: 1.1rem;
    left: 30px;
    top: 20px;
    color: #999;
  }
  input {
    padding: 0 10px 0 30px;
    border-radius: 20px;
    color: #999;
    height: 30px;
    width: calc(100% - 40px);
    background-color: #f2f2f2;
    border: 1px solid #f2f2f2;
    &.focus {
      background-color: #fff;
      border-color: #999;
    }
  }
  button {
    width: 40px;
    padding: 3px 0 0 10px;
    svg {
      font-size: 1.5rem;
      color: #262626;
    }
  }
`;

function Search({ placeholder, onChange, onClick }) {
  const [focus, setFocus] = useState('');

  const onFocus = () => {
    setFocus('focus');
  };
  const onBlur = () => {
    setFocus('');
  };

  return (
    <SearchBox>
      <AiOutlineSearch className="sch_icon" />
      <input
        className={focus}
        onFocus={onFocus}
        onBlur={onBlur}
        name="search"
        placeholder={placeholder}
        onChange={onChange}
      />
      <button onClick={onClick}>
        <IoCloseOutline />
      </button>
    </SearchBox>
  );
}

export default Search;
