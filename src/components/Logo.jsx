import React from 'react';
import Tilt from 'react-parallax-tilt';
import logoImg from './logo.png';

function Logo() {
  return (
      <div 
      className="ma4 mt0"
      style={{
          display: 'flex',
          width: '100%' 
        }}
      >
        <Tilt>
            <img src={logoImg} alt="logo" style={{ height: '150px', width: '150px' }} />
        </Tilt>
      </div>
  );
}
 
export default Logo;