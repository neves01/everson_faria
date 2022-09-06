import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';

import styles from './Listagem.module.css';

import { GrEdit } from 'react-icons/gr';
import { AiTwotoneDelete } from 'react-icons/ai';
import dayjs from 'dayjs';
import { formatToBRL } from 'brazilian-values';

interface IRegister {
    id: string;
    isIncoming: boolean;
    description: string;
    value: number;
    date: Date;
}

export const ListagemRegistro = () => {

    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [searchRegisterDescription, setSearchRegisterDescription] = useState('');

    const handleClose = () => {
        setShow(false);
        setShowDelete(false);
    }
    const handleShow = () => {
        setShow(true);
        setShowDelete(true)
    }

    const [registers, setRegisters] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3333/register/${searchRegisterDescription}`)
            .then(response => response.json())
            .then(data => setRegisters(data))
            .catch((error) => console.log(error));

    }, [searchRegisterDescription]);

    const handleOnChangeSearchRegisterDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchRegisterDescription(e.target.value);
    }

    const badgeIsEntrada = (e: boolean) => e ? 'success' : 'danger';

    const handleOnClickDelete = (id: string) => {
        fetch(`http://localhost:3333/register/delete/${id}`)
            .then(response => {
                if (response.status === 200) {
                    setShowDelete(true);
                    const registers_after_remove = [...registers];
                    registers_after_remove.splice(registers_after_remove.findIndex((v: IRegister) => v.id === id), 1);
                    setRegisters(registers_after_remove);
                }
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className={styles.table}>
            <Modal show={showDelete} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Registro excluído com sucesso!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Registro foi removido da base de dados.</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleClose}>
                        Concluir
                    </Button>
                </Modal.Footer>
            </Modal>
            <FormGroup>
                <h4>Buscar Registro pela Descrição</h4>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Filtragem pela descrição"
                    className="mb-3"
                >
                    <Form.Control type="text" value={searchRegisterDescription} onChange={handleOnChangeSearchRegisterDescription} />
                </FloatingLabel>
            </FormGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Categoria</th>
                        <th>Valor</th>
                        <th>Descrição</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {registers?.length > 0 && registers.map((r: IRegister) => (
                        <tr key={r.id}>
                            <td><Badge pill bg={badgeIsEntrada(r.isIncoming)}>{r.isIncoming ? "Entrada" : "Saída"}</Badge>{' '}</td>
                            <td>{formatToBRL(r.value)}</td>
                            <td>{r.description}</td>
                            <td>{dayjs(r.date).format('DD/MM/YYYY')}</td>
                            <td>
                                <div className={styles.icones}>
                                    <Button href={`editar_registro?id=${r.id}`} variant="warning"> Editar <GrEdit size={20} /></Button>
                                    <Button variant="danger" onClick={() => handleOnClickDelete(r.id)}> Excluir <AiTwotoneDelete size={20} /></Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div >
    );
}