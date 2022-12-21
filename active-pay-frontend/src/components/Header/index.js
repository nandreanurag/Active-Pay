import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Image,
  NavLink,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import QrReader from "react-qr-scanner";
import axios from "../../axios";
import SearchBox from "../SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userActions";
import { getRewardPoints } from "../../actions/rewardActions";
import { listCards } from "../../actions/cardActions";
import "./index.scss";
import { payAmount } from "../../actions/paymnetActions";

const Header = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cardList = useSelector((state) => state.cardList);
  const { cards, error: errorCards, loading: loadingCards } = cardList;

  const rewardPoints = useSelector((state) => state.rewardPoints);
  const { coins } = rewardPoints;
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState("Empty");
  const [toggleCamera, setToggleCamera] = useState(true);
  const [card, setCard] = useState("Select a Card");
  const [amount, setAmount] = useState();

  const handleCloseModal = () => {
    setToggleCamera(true);
    setShowModal(false);
  };

  const handleShowModal = () => {
    console.log("card", cards[0]);
    setShowModal(true);
  };

  const handleScan = (data) => {
    if (data != null) {
      setToggleCamera(!toggleCamera);
      setResult(data.text);
    }
  };

  const handleBuyAmount = (e) => {
    setAmount(e.target.value);
  };

  const addPayment = () => {
    console.log("card", card.cardNumber);
    console.log("amount", amount);
    setShowModal(false);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    axios
      .post(
        `/api/cards/${card.cardNumber}/createStatements`,
        {
          amount: amount,
          vendor: result,
          credDeb: false,
          category: "UPI",
          cardNumber: card.cardNumber,
          transactionDateTime: Date.now(),
          userAssociated: userInfo.user.email,
        },
        config
      )
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
      
  };

  const handleError = (err) => {
    console.error(err);
  };
  const previewStyle = {
    height: 240,
    width: 320,
  };

  // const [coins, setCoins] = useState(135);
  useEffect(() => {
    if (userInfo) {
      dispatch(getRewardPoints());
      dispatch(listCards());
    }
  }, [userInfo, dispatch]);

  const logoutHandler = () => {
    dispatch(logout());
  };

  const handleCardChange = (e) => {
    // console.log("card value ", e.target.value);
    // setCard(cards[e.target.value]);

    cards.forEach((element) => {
      //console.log("card 1 ",element)
      if (element.id == e.target.value) {
        setCard(element);
      }
    });
  };

  return (
    <header>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        collapseOnSelect
        className="Navbar1"
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <p className="logo">ActivePay</p>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Route render={({ history }) => <SearchBox history={history} />} />
            <Nav className="ml-auto">
              {userInfo ? (
                <>
                  {/* <Button onClick={handleShowModal} variant="outline-success"> */}
                  <NavLink onClick={handleShowModal}> Scan & Pay </NavLink>
                  {/* </Button> */}
                  <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    keyboard={true}
                    // = "modal-container"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title className="back-color">
                        Scan and Pay
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                      style={{ paddingBottom: "0" }}
                      className="back-color"
                    >
                      {toggleCamera && (
                        <QrReader
                          style={previewStyle}
                          onError={handleError}
                          onScan={handleScan}
                          className="qr-scanner"
                        />
                      )}
                      {!toggleCamera && (
                        <div>
                          <h2 className="back-color pad-10">$</h2>
                          <h6 className="back-color pad-12">{result} </h6>
                          {/* <h5>{card.cardNumber}</h5> */}
                          <div className="pad-12">
                            <select
                              className="select-stylin"
                              onChange={handleCardChange}
                            >
                              <option value="Select a card">
                                {" "}
                                -- Select a Card --{" "}
                              </option>

                              {cards.map((card) => (
                                <option value={card.id}>
                                  {card.cardNumber}
                                </option>
                              ))}
                            </select>
                          </div>{" "}
                          <br />
                          <div className="col-12 pad-12">
                            <input
                              type="text"
                              className="textbox-12"
                              placeholder="Enter amount"
                              value={amount}
                              onChange={handleBuyAmount}
                            />
                            <span className="focus-border-12"></span> <br />
                          </div>
                        </div>
                      )}
                    </Modal.Body>
                    <Modal.Footer className="back-color btn-action">
                      {!toggleCamera && (
                        <Button
                          onClick={addPayment}
                          className="btn btn-outline-success btn btn-primary justify-content-center"
                          // disabled={disableButton}
                        >
                          Pay
                        </Button>
                      )}
                    </Modal.Footer>
                  </Modal>
                  {coins && (
                    <LinkContainer
                      style={{ paddingRight: "2rem" }}
                      to="/rewards"
                    >
                      <NavLink>
                        <i className="fas fa-coins fa-lg"></i> {coins}
                      </NavLink>
                    </LinkContainer>
                  )}

                  <NavDropdown title={userInfo.user.email} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="admin-menu">
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
