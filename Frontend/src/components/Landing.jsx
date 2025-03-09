import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {

  const navigate = useNavigate();

  return (

    <section className="landing-container">
      <div className="content">
        <h2>Bid. Win. Repeat. Your Ultimate Auction Experience!</h2>
        <p>
          Discover a world of exciting auctions, incredible deals, and a passionate community. 
        </p>
        <button onClick={() => navigate('/signin')} className="cta-button"> Get Started </button>
      </div>
    </section>

  );

}

export default Landing;
