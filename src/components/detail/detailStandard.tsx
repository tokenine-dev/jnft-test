// import { Button, Col, Form, Row } from 'react-bootstrap';
// import { useEthers } from '@usedapp/core';
import { useState } from "react";

const DetailStandard = () => {
  const [selected, setselected] = useState("BNB");
  // const { activateBrowserWallet, deactivate, account } = useEthers();
  function onChangeSelect({
    target,
  }: {
    target: { name: string; value: string };
  }) {
    setselected(target.value);
  }

  function dropDowm() {
    return (
      <>
        {/* <Form>
                    <Form.Group as={Col} controlId="formGridState">
                         <Form.Control as="select" defaultValue={selected} onChange={onChangeSelect} name="selected" value={selected}>
                              <option>BNB</option>
                              <option>DEGO</option>
                         </Form.Control>
                    </Form.Group>
               </Form> */}
      </>
    );
  }
  return (
    <>
      {/* <Row>
               <Col md={4}>
                    <img className="img-detail" src="https://www.brighttv.co.th/wp-content/uploads/2018/08/pp550x550.u1.jpg" alt="detail_image" />
               </Col>
               <Col md={8} className="info-standard">
                    <Row className="info-top">
                         <Col className="col-nomargin" md={10}>
                              <h3>knowing humpback</h3>
                         </Col>
                         <Col className="col-nomargin" md={2}>
                              <Button className="custom-button" variant="outline-secondary">
                                   Share
                              </Button>
                         </Col>
                    </Row>
                    <Row className="info-below">
                         <Col md={12}>
                              <Row className="row-below">
                                   <p>Current price</p>
                              </Row>
                              <Row className="row-below ">
                                   <h5 className="price">1.100000</h5>
                                   <div className="dropdown-div">{dropDowm()}</div>
                              </Row>
                              <Row className="row-below ">
                                   <p>≈ $540.0490</p>
                              </Row>
                              <Row className="row-below">
                                   <p>Amount：1</p>
                              </Row>
                         </Col>
                         {account ? (
                              <Button className="buton-below" variant="success" onClick={() => deactivate()}>
                                   Buy With {selected}
                              </Button>
                         ) : (
                              <Button className="buton-below" variant="success" onClick={() => activateBrowserWallet()}>
                                   Connect Wallet
                              </Button>
                         )}
                    </Row>
               </Col>
          </Row> */}
    </>
  );
};

export default DetailStandard;
