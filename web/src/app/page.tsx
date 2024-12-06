'use client'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchData = async () => {
  const response = await axios.get('http://localhost:4000/user');
  return response.data;
};

export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>
  return (
    <>
      <div>
        home
        <pre className='text-yellow-700'>{JSON.stringify(data, null, 2)}</pre> 
      </div>
    </>
  );
}
