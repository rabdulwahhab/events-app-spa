import { Nav, Navbar, Button, Form, FormControl } from 'react-bootstrap';

export default function Header({currentPage}) {
  return (
    <Navbar variant="dark" bg="dark" className="p-4">
      <Navbar.Brand href="/">{"Events"}</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/events">{"View Events"}</Nav.Link>
      </Nav>
      <Form inline>
        <FormControl type="text" placeholder="email" className="mr-sm-2" />
        <Button variant="outline-primary">{"Sign in"}</Button>
      </Form>
    </Navbar>
  );
}
