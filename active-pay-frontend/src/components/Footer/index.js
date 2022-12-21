import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <div
      className="pb-0 mb-0 justify-content-center text-light"
      //style={{ backgroundColor: '#333940' }}
      style={{backgroundColor:"rgba(0,0,0,0.5)" }}
      //style={{background-image: "linear-gradient(to right, #fbc2eb 0%, #a6c1ee 51%, #fbc2eb 100%)"}}
    >
      <footer>
        <Container>
          <div className="row my-5 py-5">
            <div className="col-12">
              <div className="row ">
                <div className="col-xl-6 col-md-4 col-sm-4 col-12 my-auto mx-auto a">
                  <h3
                    //className="text-muted mb-md-0 mb-5 bold-text"
                    style={{ fontSize: '35px',color:"white" }}
                  >
                    ActivePay
                  </h3>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-4 col-12">
                  <h6 className="mb-3 mb-lg-4 text-muted bold-text mt-sm-0 mt-5">
                  </h6>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-4 col-12">
                  <h6 className="mb-3 mb-lg-4 text-muted bold-text mt-sm-0 mt-5">
                  </h6>
                </div>
              </div>
              <div className="row ">
                <div className="col-xl-6 col-md-4 col-sm-4 col-auto my-md-0 mt-5 order-sm-1 order-3 align-self-end">
                  {/* <p className="social text-muted mb-0 pb-0 bold-text"> */}
                    {' '}
                    <span className="mx-2">
                      <i className="fab fa-facebook" aria-hidden="true"></i>
                    </span>{' '}
                    <span className="mx-2">
                      <i className="fab fa-linkedin" aria-hidden="true"></i>
                    </span>{' '}
                    <span className="mx-2">
                      <i className="fab fa-twitter" aria-hidden="true"></i>
                    </span>{' '}
                    <span className="mx-2">
                      <i className="fab fa-instagram" aria-hidden="true"></i>
                    </span>{' '}
                  {/* </p> */}
                  
                </div>

                <div className="col-xl-3 col-md-4 col-sm-4 col-auto order-1 align-self-end ">
                  <h6 className="mt-55 mt-2 text-muted bold-text">
                    
                      <b>Anurag Nandre</b><br/>
                      <b>Sneha Govindarajan</b>
                    </a>
                  </h6>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-4 col-auto order-2 align-self-end mt-3 ">
                  <h6 className="text-muted bold-text">
                    
                      <b>Jahnavi Gangarapu</b><br />
                      <b>Madhura Kurhadkar</b>
                    </a>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Footer;
