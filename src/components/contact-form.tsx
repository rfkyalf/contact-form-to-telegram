'use client';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import Alert from './alert';
import { useState } from 'react';
import { PulseLoader } from 'react-spinners';

interface FormInput {
  fullname: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>();

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const removeAlert = () => {
    setSuccess(false);
    setError(false);
  };

  const onSubmit = async (data: FormInput) => {
    try {
      setLoading(true);
      setShowButton(false);
      const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: `Name: ${data.fullname}\nEmail: ${data.email}\nMessage: ${data.message}`,
      });
      console.log('Message sent successfully:', response.data);
      setSuccess(true);
      reset();
    } catch (error) {
      setError(true);
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
      setShowButton(true);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8 bg-indigo-200 rounded-xl">
      <h1 className="flex justify-center items-center text-xl font-bold">Contact Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {success && <Alert bgColor={'bg-green-300'} icon={'✅'} status="Success!" message="Your message has been sent 😊" onClick={removeAlert} />}
        {error && <Alert bgColor={'bg-red-300'} icon={'❎'} status="Error!" message="Something went wrong. Please try again later 😢" onClick={removeAlert} />}

        <div className="flex flex-col gap-4 text-sm md:text-base">
          <input type="text" id="fullname" {...register('fullname', { required: 'Please enter your name' })} name="fullname" placeholder="Name*" className="py-1 px-2 rounded-md outline-none focus:ring-2 ring-indigo-700" />
          {errors.fullname && <span className="text-red-500">{errors.fullname.message}</span>}

          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address. Please use example@example.com format',
              },
            })}
            aria-invalid={errors.email ? 'true' : 'false'}
            name="email"
            placeholder="Email*"
            className="py-1 px-2 rounded-md outline-none focus:ring-2 ring-indigo-700"
          />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}

          <textarea id="message" {...register('message', { required: 'Please enter your message' })} placeholder="Message*" className="py-1 px-2 rounded-md outline-none focus:ring-2 ring-indigo-700" rows={4} />
          {errors.message && <span className="text-red-500">{errors.message.message}</span>}

          {showButton && (
            <button type="submit" className="bg-indigo-950 text-indigo-50 py-1 rounded-md hover:bg-indigo-900">
              Send Message
            </button>
          )}

          {loading && (
            <div className="flex justify-center">
              <PulseLoader size={15} color={`#1e1b4b`} speedMultiplier={0.5} />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
