import { Link } from "react-router-dom"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Navigation() {
    return (
        <nav>
            <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '300px' }}
                            navbarScroll
                        >
                            <Link to="/">
                                <button className={`btn ${window.location.pathname === '/' && 'linkNavActive'} linkNav`}>
                                    Strona Główna
                                </button>
                            </Link>
                            <Link to="/account">
                                <button className={`btn ${window.location.pathname === '/account' && 'linkNavActive'} linkNav`}>
                                    Konto
                                </button>
                            </Link>
                        </Nav>
                    </Navbar.Collapse> 
                    <div>
                    <Link to="/login" className="me-4">
                        <button type="button"
                            className="btn buttonAction buttonService" onClick={() => {sessionStorage.removeItem("accessToken"); }}>
                                Wyloguj się
                        </button>
                    </Link>
                    </div>
                </Container>
            </Navbar>
        </nav>
    )
}
export default Navigation;