// import { Col, Row } from 'react-bootstrap';
import Label from '../label/label';

type DetailContemProps = {
     dataSet: string;
};

const DetailContemInfo = ({ dataSet }: DetailContemProps) => {
     let data = JSON.parse(dataSet)
     return (
          <>
               <Label id={'contemporary-information'} title={'Contemporary Information'} />
               {/* <Row>
                    <Col md={6}>
                         {data.mockDataContem1.map((el: any) => (
                              <Row md={6}>
                                   <Col md={3}>{el.title} :</Col>
                                   <Col md={9}>{el.value}</Col>
                              </Row>
                         ))}
                    </Col>
                    <Col md={6}>
                         {data.mockDataContem2.map((el : any) => (
                              <Row md={6}>
                                   <Col md={3}>{el.title} :</Col>
                                   <Col md={9}>{el.value}</Col>
                              </Row>
                         ))}
                    </Col>
               </Row> */}
          </>
     );
};

export default DetailContemInfo;
