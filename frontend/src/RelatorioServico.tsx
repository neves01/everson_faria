import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import FormGroup from 'react-bootstrap/FormGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';

import styles from './Listagem.module.css';

import dayjs from 'dayjs';
import { formatToBRL } from 'brazilian-values';
import { Container, Navbar } from 'react-bootstrap';

interface ICustomer {
    name: string;
}

interface IService {
    id: string;
    customer: ICustomer;
    value: number;
    type: string[];
    payment: string[];
    date: Date;
}

export const RelatorioServico = () => {

    const [searchCustomerName, setSearchCustomerName] = useState("");
    const [services, setServices] = useState([] as IService[]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:3333/service/${searchCustomerName}`)
            .then(response => response.json())
            .then(data => {
                setServices(data);
                setTotal(data.reduce((sum: number, v: IService) => sum + Number(v.value), 0));
            })
            .catch((error) => console.log(error));
    }, [searchCustomerName]);

    const handleOnChangeSearchCustomerName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchCustomerName(e.target.value);
    }

    const objStrToStr = (s: string, v: string[]) => {
        var properties = s.replaceAll("\"", "").replace("{", "").replace("}", "");
        let a_p = properties.split(',');
        a_p.forEach(function (property: string) {
            v.push(property);
        });
        return v;
    }

    return (
        <div className={styles.table}>
            <FormGroup>
                <h4>Busca por nome Cliente</h4>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Filtragem pelo nome Cliente"
                    className="mb-3"
                >
                    <Form.Control type="text" value={searchCustomerName} onChange={handleOnChangeSearchCustomerName} />
                </FloatingLabel>

            </FormGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Tipos</th>
                        <th>Forma Pagamento</th>
                        <th>Valor</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {services?.length > 0 && services.map((s: IService) => (
                        <tr key={s.id}>
                            <td>{s.customer.name}</td>
                            <td>{objStrToStr(s.type.toString(), []).join(', ')}</td>
                            <td>{objStrToStr(s.payment.toString(), []).join(', ')}</td>
                            <td>{formatToBRL(s.value)}</td>
                            <td>{dayjs(s.date).format('DD/MM/YYYY')}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Navbar expand="lg" variant="dark" bg="dark" fixed="bottom" >
                <Container>
                    <Navbar.Brand href="#">
                        Total gasto por determinado(s) cliente(s):
                    </Navbar.Brand>
                    <div className={styles.botoes}>
                        <h3>
                            <Badge pill bg="success">
                                Total gasto: {formatToBRL(total)}
                            </Badge>
                        </h3>
                    </div>
                </Container>
            </Navbar>
        </div >
    );
}