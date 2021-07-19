// import { Card } from 'react-bootstrap';

type CardProps = {
    title: string,
    price: number,
    amount: number
}

const CardProduct = ({ title, price, amount }: CardProps) => {

    const key = Math.floor((Math.random() * 10) + 1)

    return (
        <>
            {/* <Card>
                <Card.Img variant="top" className="bbdd" src={`https://picsum.photos/id/${key}/300/240`} />
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>
                        Price： {price.toFixed(4)} BNB
                    </Card.Text>
                    <Card.Text>
                        Amount：{amount}
                    </Card.Text>
                </Card.Body>
            </Card> */}
        </>
    )
}

export default CardProduct