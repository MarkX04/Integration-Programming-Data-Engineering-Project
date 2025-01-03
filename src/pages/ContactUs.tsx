import React, { useState } from 'react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    sendCopy: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Check if the input is a checkbox
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="mt-10 flex min-h-screen w-full flex-col items-center space-y-10 overflow-auto bg-background p-6">
      <div className="relative mt-5 w-full max-w-lg rounded-lg bg-white p-10 shadow-lg">
        <h2 className="mb-4 text-3xl font-bold">We’d Love to Hear from You</h2>
        <p className="mb-6 text-gray-600">
          Please submit your information and a representative will get in touch with you.
        </p>
        <p className="text-purple-700 mb-4 font-semibold">
          <a href="tel:+1234567890" className="underline">
            Call us: +1 (123) 456-7890
          </a>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div className="mb-4">
            <textarea
              name="message"
              placeholder="Your message"
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              rows={4}
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="sendCopy"
              checked={formData.sendCopy}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="sendCopy" className="text-gray-700">
              Send me a copy
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-pink-500 py-3 font-semibold text-white transition-colors hover:bg-pink-600"
          >
            Send a Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
