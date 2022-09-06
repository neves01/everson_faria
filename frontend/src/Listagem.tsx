import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import styles from './Listagem.module.css';

import { GrEdit } from 'react-icons/gr';
import { AiTwotoneDelete } from 'react-icons/ai';

interface ICustomer {
    id: string;
    name: string;
    phone: string;
    birth: Date;
}

export const Listagem = () => {

    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [searchCustomerName, setSearchCustomerName] = useState('');

    const handleClose = () => {
        setShow(false);
        setShowDelete(false);
    }
    const handleShow = () => {
        setShow(true);
        setShowDelete(true)
    }

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3333/customer/${searchCustomerName}`)
            .then(response => response.json())
            .then(data => setCustomers(data))
            .catch((error) => console.log(error));
    }, [searchCustomerName]);

    const handleOnChangeSearchCustomerName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchCustomerName(e.target.value);
    }

    const handleOnClickDelete = (id: string) => {
        fetch(`http://localhost:3333/customer/delete/${id}`)
            .then(response => {
                if (response.status === 200) {
                    setShowDelete(true);
                    const customers_after_remove = [...customers];
                    customers_after_remove.splice(customers_after_remove.findIndex((v: ICustomer) => v.id === id), 1);
                    setCustomers(customers_after_remove);
                }
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className={styles.table}>
            <Modal show={showDelete} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cliente excluído com sucesso!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Cliente foi removido da base de dados.</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleClose}>
                        Concluir
                    </Button>
                </Modal.Footer>
            </Modal>
            <FormGroup>
                <h4>Nome do Cliente</h4>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Filtragem pelo nome"
                    className="mb-3"
                >
                    <Form.Control type="text" value={searchCustomerName} onChange={handleOnChangeSearchCustomerName} />
                </FloatingLabel>
            </FormGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Data nascimento</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {customers?.length > 0 && customers.map((c: ICustomer) => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{dayjs(c.birth).format('DD/MM/YYYY')}</td>
                            <td>
                                <div className={styles.icones}>
                                    <Button href={`editar_cliente?id=${c.id}`} variant="warning"> Editar <GrEdit size={20} /></Button>
                                    <Button variant="danger" onClick={() => handleOnClickDelete(c.id)}> Excluir <AiTwotoneDelete size={20} /></Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div >
    );
}