import { useEffect, useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FormGroup } from 'react-bootstrap';
import * as zod from 'zod';
import { parseISO } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import styles from './Cadastro.module.css';

const formValidationSchema = zod.object({
    name: zod.string().min(5),
    phone: zod.string().min(8),
    birth: zod.string()
})

type NewCycleFormData = zod.infer<typeof formValidationSchema>

export const Editar = () => {

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const { register, handleSubmit, watch, reset, setValue } = useForm<NewCycleFormData>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            name: '',
            phone: '',
            birth: undefined
        },
    });

    const [customerId, setCustomerId] = useState("");

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id');
        setCustomerId(String(urlParams.get('id')));
        fetch(`http://localhost:3333/customer/id/${id}`)
            .then(response => response.json())
            .then(async (data) => {
                setValue('name', data.name);
                setValue('birth', dayjs(data.birth).format('YYYY-MM-DD'));
                setValue('phone', data.phone);
            })
            .catch(err => err);
    }, []);

    const [show, setShow] = useState(false);

    const onSubmit = (data: any) => {

        const date = parseISO(data.birth)
        
        data.id = customerId;
        data.birth = date;

        fetch('http://localhost:3333/customer', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response);
                handleShow();
                return response;

            } else {
                console.log('response');
            }
        }).catch(err => err);
    }

    return (
        <div className={styles.main}>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cliente atualizado com sucesso!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Agora, caso deseje visualizar todos os Clientes, vá no menu <strong>Cliente - Listar</strong>...</Modal.Body>
                <Modal.Footer>
                    <Button href="/listar_cliente" variant="success" onClick={handleClose}>
                        Concluir
                    </Button>
                </Modal.Footer>
            </Modal>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormGroup className={styles.group}>
                    <h4>Nome do Cliente</h4>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Nome"
                        className="mb-3"

                    >
                        <Form.Control type="text" placeholder="Nome do Cliente" {...register('name')} />
                    </FloatingLabel>
                    <h4>Telefone do Cliente</h4>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Telefone"
                        className="mb-3"

                    >
                        <Form.Control type="text" placeholder="Telefone do Cliente" {...register('phone')} />
                    </FloatingLabel>

                    <h4>Nascimento do Cliente</h4>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Nascimento"
                        className="mb-3"

                    >
                        <Form.Control type="date" {...register('birth', {
                            valueAsDate: false
                        })} />
                    </FloatingLabel>
                </FormGroup>

                <Navbar expand="lg" variant="dark" bg="dark" fixed="bottom" >
                    <Container>
                        <Navbar.Brand href="#">Opções do formulário</Navbar.Brand>
                        <div className={styles.botoes}>
                            <Button variant="success" type="submit">Gravar</Button>
                            <Button type="reset" variant="warning">Limpar</Button>
                        </div>
                    </Container>
                </Navbar>

            </Form>


        </div>
    );
}