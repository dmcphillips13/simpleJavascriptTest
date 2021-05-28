import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [checkboxes, setCheckboxes] = useState([]);
  const [creditor, setCreditor] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [minPay, setMinPay] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const result = await axios(
          'https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json'
        );

        setData(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResult();
  }, []);

  useEffect(() => {
    setCheckboxes(new Array(data.length).fill(false));
  }, [data]);

  useEffect(() => {
    setCheckboxes(
      checkboxes.map((checkbox) => (checkbox = selectAll ? true : false))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAll]);

  const handleCheck = (idx) => {
    if (idx === 'all') {
      setSelectAll(!selectAll);
    } else {
      setCheckboxes(
        checkboxes.map(
          (checkbox, i) => (checkbox = i === idx ? !checkbox : checkbox)
        )
      );
    }
  };

  const handleRemove = () => {
    setData(data.filter((entry, idx) => !checkboxes[idx]));
  };

  const handleInput = (ev) => {
    if (ev.target.className === 'creditor') setCreditor(ev.target.value);
    if (ev.target.className === 'firstName') setFirstName(ev.target.value);
    if (ev.target.className === 'lastName') setLastName(ev.target.value);
    if (ev.target.className === 'minPay') setMinPay(ev.target.value);
    if (ev.target.className === 'balance') setBalance(ev.target.value);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setData([
      ...data,
      {
        id: data[data.length - 1].id + 1,
        creditorName: creditor,
        firstName,
        lastName,
        minPaymentPercentage: parseFloat(minPay).toFixed(1),
        balance: parseFloat(balance).toFixed(2),
      },
    ]);
    setCreditor('');
    setFirstName('');
    setLastName('');
    setMinPay('');
    setBalance('');
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="App">
      <table>
        <col width="100px" />
        <thead>
          <tr>
            <th className="checkbox">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={() => handleCheck('all')}
              />
            </th>
            <th>Creditor</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Min Pay %</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => {
            return (
              <tr key={entry.id}>
                <td className="checkbox">
                  <input
                    type="checkbox"
                    checked={checkboxes[idx] ? true : false}
                    onChange={() => handleCheck(idx)}
                  />
                </td>
                <td>{entry.creditorName}</td>
                <td>{entry.firstName}</td>
                <td>{entry.lastName}</td>
                <td>{entry.minPaymentPercentage}%</td>
                {/* <td>{entry.minPaymentPercentage.toFixed(2)}%</td> */}
                <td>{entry.balance}</td>
                {/* <td>{entry.balance.toFixed(2)}</td> */}
              </tr>
            );
          })}
          <tr>
            <td className="button-container">
              <button onClick={handleSubmit}>Add Debt</button>
            </td>
            <td>
              <input
                value={creditor}
                className="creditor"
                onChange={handleInput}
              ></input>
            </td>
            <td>
              <input
                value={firstName}
                className="firstName"
                onChange={handleInput}
              ></input>
            </td>
            <td>
              <input
                value={lastName}
                className="lastName"
                onChange={handleInput}
              ></input>
            </td>
            <td>
              <input
                value={minPay}
                className="minPay"
                onChange={handleInput}
              ></input>
            </td>
            <td>
              <input
                value={balance}
                className="balance"
                onChange={handleInput}
              ></input>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr></tr>
          <tr>
            <th className="button-container">
              <button onClick={handleRemove}>Remove Debt</button>
            </th>
          </tr>
          <tr className="balance">
            <th colSpan={2}>Total</th>
            <th colSpan={3}></th>
            <th>
              {formatter.format(
                data.reduce((accum, entry, idx) => {
                  if (checkboxes[idx]) accum += entry.balance;
                  return accum;
                }, 0)
              )}
            </th>
          </tr>
          <tr className="totals">
            <th colSpan={2}>Total Row Count: {data.length}</th>
            <th colSpan={2}>
              Check Row Count:{' '}
              {checkboxes.filter((checkbox) => checkbox).length}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default App;
