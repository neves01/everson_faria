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

interface IType {
    id: string;
    description: string;
    title: string;
}

export const ListagemTipo = () => {

    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [searchTypeTitle, setSearchTypeTitle] = useState('');

    const handleClose = () => {
        setShow(false);
        setShowDelete(false);
    }
    const handleShow = () => {
        setShow(true);
        setShowDelete(true)
    }

    const [types, setTypes] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3333/type/${searchTypeTitle}`)
            .then(response => response.json())
            .then(data => setTypes(data))
            .catch((error) => console.log(error));
    }, [searchTypeTitle]);

    const handleOnChangeSearchTypeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTypeTitle(e.target.value);
    }

    const handleOnClickDelete = (id: string) => {
        fetch(`http://localhost:3333/type/delete/${id}`)
            .then(response => {
                if (response.status === 200) {
                    setShowDelete(true);
                    const types_after_remove = [...types];
                    types_after_remove.splice(types_after_remove.findIndex((v: IType) => v.id === id), 1);
                    setTypes(types_after_remove);
                }
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className={styles.table}>
            <Modal show={showDelete} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Tipo excluído com sucesso!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tipo foi removido da base de dados.</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleClose}>
                        Concluir
                    </Button>
                </Modal.Footer>
            </Modal>
            <FormGroup>
                <h4>Título do Tipo</h4>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Filtragem pelo titulo"
                    className="mb-3"
                >
                    <Form.Control type="text" value={searchTypeTitle} onChange={handleOnChangeSearchTypeTitle} />
                </FloatingLabel>
            </FormGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Descrição</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {types?.length > 0 && types.map((c: IType) => (
                        <tr key={c.id}>
                            <td>{c.title}</td>
                            <td>{c.description}</td>
                            <td>
                                <div className={styles.icones}>
                                    <Button href={`editar_tipo?id=${c.id}`} variant="warning"> Editar <GrEdit size={20} /></Button>
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