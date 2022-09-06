import { useEffect, useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FormGroup, InputGroup } from 'react-bootstrap';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import styles from './Cadastro.module.css';

interface ICustomer {
    id: string;
    name: string;
    phone: string;
    birth: Date;
}

interface IType {
    id: string;
    title: string;
    description: string;
}

const formValidationSchema = zod.object({
    customer: zod.string().uuid(),
    description: zod.string(),
    value: zod.any(),
    type: zod.boolean().array(),
    payment: zod.boolean().array()
})

type NewCycleFormData = zod.infer<typeof formValidationSchema>

export const CadastroService = () => {

    useEffect(() => {
        fetch('http://localhost:3333/customer', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            if (response.status >= 200 && response.status < 300) {
                const json = await response.json();
                setCustomers(json);
            }
        }).catch(err => err);

        fetch('http://localhost:3333/type', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            if (response.status >= 200 && response.status < 300) {
                const json = await response.json();
                setTypes(json);
            }
        }).catch(err => err);

    }, []);

    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [types, setTypes] = useState<IType[]>([]);

    const payments = ["Cartão de Crédito", "Cartão de Débito", "Dinheiro", "Pix"];

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            customer: '-1',
            value: 0,
            description: '',
            type: [] as boolean[],
            payment: [] as boolean[]
        },
    })

    const onSubmit = (data: any) => {

        fetch('http://localhost:3333/service', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response);
                handleShow();
                return response;
            }
        }).catch(err => err);
    }

    return (
        <div className={styles.main}>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Serviço cadastrado com sucesso!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Para ver os serviços cadastrados vamos em <strong>Serviço - Listar</strong>...</Modal.Body>
                <Modal.Footer>
                    <Button href="/listar_servico" variant="success" onClick={handleClose}>
                        Concluir
                    </Button>
                </Modal.Footer>
            </Modal>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormGroup className={styles.group}>
                    <h4>Selecione o Cliente</h4>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Cliente"
                        className="mb-3"

                    >
                        <Form.Select {...register('customer')} >
                            <option value={"-1"}>Selecione um Cliente</option>
                            {customers.map((c: ICustomer) => (
                                <option id={c.id} key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    <h4>Selecione o Tipo do serviço</h4>
                    <FloatingLabel
                        controlId="floatingInput"
                        label=""
                        className="mb-3"

                    >
                        {types.map((t: IType, i) => (
                            <Form.Check
                                inline
                                type="checkbox"
                                key={`type-${t.id}`}
                                id={`type-${t.id}`}
                                label={`${t.title}`}
                                {...register(`type.${i}`)}
                            />

                        ))}
                    </FloatingLabel>

                    <h4>Valor do Serviço</h4>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Valor do Serviço (R$)"
                        className="mb-3"
                        onFocus={handleFocus}

                    >
                        <Form.Control type="number" min="0.00" max="10000.00" step="0.01" {...register("value")} />
                    </FloatingLabel>

                    <h4>Descrição do Serviço</h4>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Descrição do Serviço"
                        className="mb-3"

                    >
                        <Form.Control type="text" {...register("description")} />
                    </FloatingLabel>


                    <h4>Forma de Pagamento</h4>
                    <FloatingLabel
                        controlId="floatingInput"
                        label=""
                        className="mb-3"

                    >

                        {payments.map((t, i) => (
                            <Form.Check
                                inline
                                type="checkbox"
                                key={`type-${t}`}
                                id={`type-${t}`}
                                label={`${t}`}
                                {...register(`payment.${i}`)}
                            />

                        ))}


                    </FloatingLabel>


                </FormGroup>

                <Navbar expand="lg" variant="dark" bg="dark" fixed="bottom" >
                    <Container>
                        <Navbar.Brand href="#">Opções do formulário</Navbar.Brand>
                        <div className={styles.botoes}>
                            <Button variant="success" type="submit">Gravar</Button>
                            <Button variant="warning" onClick={() => reset()}>Limpar</Button>
                        </div>
                    </Container>
                </Navbar>

            </Form>


        </div>
    );
}