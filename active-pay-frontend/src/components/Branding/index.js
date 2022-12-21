import React from 'react';
import './styles.scss';

import { Link } from 'react-router-dom';

const Branding = () => {
  return (
    <>
      <div className='upperbg'>
     <p className='Main'>
      <p className="Mainslogan">
        THE DEAL IS ON! 
        <div className="secondline">Get Rewards with Payments</div>
      </p></p>
      <br />
      <br />
      <p className='content'>
        Manage everything directly and easy with ActivePay.Spend more time living your life and less time worrying about paying off your bills<br/>Changing the way we manage finances. Fair, transparent, and friendly with features like giving off rewards , paying through scan QR code also adding required cards.
      </p>
     
      </div>

      <div className="container h-100">
        <div className="row align-middle">
          <div className="col-md-6 col-lg-4 my-column">
            <div className="card gr-1">
              <div className="txt">
                <h1>
                  Think Outside.
                  <br></br>
                  more often.
                </h1>
                <p>exclusive rewards for paying your bills</p>
              </div>
              <Link to="/rewards" style={{Color:"white"}}>More</Link>
              <div className="ico-card">
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 my-column">
            <div className="card gr-2">
              <div className="txt">
                <h1>
                  It's How Transactions
                  <br></br>
                  Are Done.
                </h1>
                <p>so that you don’t have to.</p>
              </div>
              <Link to="/profile" style={{Color:"white"}}>More</Link>
              <div className="ico-card">
                {/* <i className="fas fa-shield-alt"></i> */}
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 my-column">
            <div className="card gr-3">
              <div className="txt">
                <h1>
                  simply add your<br></br>
                  credit card
                </h1>
                <p>Staying smarter, together</p>
              </div>
              <Link to="/cards/add/new" style={{Color:"white"}}>More</Link>
              <div className="ico-card">
                {/* <i className="far fa-credit-card"></i> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Branding;
