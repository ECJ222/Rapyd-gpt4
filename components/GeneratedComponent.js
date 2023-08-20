import React, { useRef } from 'react';

const PaymentForm = ({ onFormComplete }) => {
  const amountRef = useRef();
  const numberRef = useRef();
  const expMonthRef = useRef();
  const expYearRef = useRef();
  const cvvRef = useRef();
  const nameRef = useRef();
  const networkRefIdRef = useRef();
  const recurrenceTypeRef = useRef();

  const handleFormComplete = e => {
    e.preventDefault();

    const formData = {
      amount: amountRef.current.value,
      number: numberRef.current.value,
      expiration_month: expMonthRef.current.value,
      expiration_year: expYearRef.current.value,
      cvv: cvvRef.current.value,
      name: nameRef.current.value,
      network_reference_id: networkRefIdRef.current.value,
      recurrence_type: recurrenceTypeRef.current.value,
    }

    const missingFields = Object.entries(formData).filter(([key, value]) => !value).map(([key]) => key);

    if (missingFields.length > 0) {
      console.log('Missing fields: ', missingFields);
      return;
    }

    onFormComplete(formData);
  };

  return (
    <form className="flex flex-col items-center justify-center space-y-3 p-10">
      <input ref={amountRef} type="number" placeholder="Amount" className="border-2 border-gray-300 p-2 rounded-lg" />
      <input ref={numberRef} type="number" placeholder="Number" className="border-2 border-gray-300 p-2 rounded-lg" />
      <input ref={expMonthRef} type="number" placeholder="Expiration Month" className="border-2 border-gray-300 p-2 rounded-lg" />
      <input ref={expYearRef} type="number" placeholder="Expiration Year" className="border-2 border-gray-300 p-2 rounded-lg" />
      <input ref={cvvRef} type="number" placeholder="CVV" className="border-2 border-gray-300 p-2 rounded-lg" />
      <input ref={nameRef} type="text" placeholder="Name" className="border-2 border-gray-300 p-2 rounded-lg" />
      <input ref={networkRefIdRef} type="text" placeholder="Network Reference ID" className="border-2 border-gray-300 p-2 rounded-lg" />
      <input ref={recurrenceTypeRef} type="text" placeholder="Recurrence Type" className="border-2 border-gray-300 p-2 rounded-lg" />
      <button onClick={handleFormComplete} className="bg-black text-white px-5 py-2 rounded-lg w-1/2 shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50">Submit</button>
    </form>
  );
};
export default PaymentForm;