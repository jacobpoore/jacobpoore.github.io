import { useState } from 'react';

export default function Dropdown({ content }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {isOpen ? 'Hide' : 'Read More'}
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-700 whitespace-pre-line">{content}</p>
      )}
    </div>
  );
}
