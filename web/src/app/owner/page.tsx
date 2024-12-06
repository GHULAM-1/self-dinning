import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

// Define the type for the form data
interface FormData {
  name: string;
  email: string;
}

// Function to make the POST request
const postData = async (data: FormData) => {
  const response = await axios.post('https://api.example.com/data', data);
  return response.data; // Return the response data from the server
};

function MyComponent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Use the useMutation hook with TypeScript types
  const mutation = useMutation<any, Error, FormData>(postData, {
    onSuccess: (data) => {
      console.log('Data successfully submitted:', data);
    },
    onError: (error) => {
      console.error('Error submitting data:', error);
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData: FormData = {
      name,
      email,
    };

    mutation.mutate(formData);
  };

  return (
    <div>
      <h1>Submit Data</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>

      {/* Display loading, error, or success messages */}
      {mutation.isLoading && <p>Submitting...</p>}
      {mutation.isError && <p style={{ color: 'red' }}>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>Data submitted successfully!</p>}
    </div>
  );
}

export default MyComponent;