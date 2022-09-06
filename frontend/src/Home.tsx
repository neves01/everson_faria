
import Carousel from 'react-bootstrap/Carousel';

import Card from 'react-bootstrap/Card';

import styles from './Home.module.css';

import home1 from './assets/home1.jpg';
import home2 from './assets/home2.jpg';
import home3 from './assets/home3.jpg';

export function Home() {

    return (
        <div className={styles.home}>
            <Card style={{ width: '100%' }}>
                <Card.Img variant="top" src={home1} />
                <Card.Body>
                    <Card.Title>Gerenciando meu salão</Card.Title>
                    <Card.Text>
                        Sistema de gerenciamento feito sob demanda para <strong>Everson Faria</strong>.
            </Card.Text>
        </Card.Body>
            </Card >
        </div >
    );
}