import React from 'react';

const Home = ({ id }) => {
  const styles = {
    backgroundImage: `url(https://picsum.photos/1200/580?random=${id}`,
    backgroundSize: 'cover',
    height: '100vh',
  };
  return (
    <div style={styles} />
  );
};

export default Home;
