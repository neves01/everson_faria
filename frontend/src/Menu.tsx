
import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

export function Menu() {

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>Everson</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <NavDropdown title="Cliente" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/cadastrar_cliente">Cadastrar</NavDropdown.Item>
                            <NavDropdown.Item href="/listar_cliente">Listar</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Tipo" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/cadastrar_tipo">Cadastrar</NavDropdown.Item>
                            <NavDropdown.Item href="/listar_tipo">Listar</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Serviço" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/cadastrar_servico">Cadastrar</NavDropdown.Item>
                            <NavDropdown.Item href="/listar_servico">Listar</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Registros Financeiros" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/cadastrar_registro">Cadastrar</NavDropdown.Item>
                            <NavDropdown.Item href="/listar_registro">Listar</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Relatórios" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/relatorio_servico">Serviços</NavDropdown.Item>
                            <NavDropdown.Item href="/relatorio_registro">Registros</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}